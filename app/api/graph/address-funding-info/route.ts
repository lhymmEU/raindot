import { NextRequest, NextResponse } from "next/server";
import { getDriver } from "@/lib/driverStore";

interface AddressInfo {
  address: string;
  totalRefs?: {
    id: number;
    requested: number;
    status: string;
  }[];
  funding?: {
    category: string;
    amount: number;
    refs: number[];
  }[];
  voting?: {
    refId: number;
    category: string[];
    power: number;
    decision: "AYE" | "NAY" | "ABSTAIN";
  }[];
}

export async function GET(req: NextRequest) {
    const address = req.nextUrl.searchParams.get("address");
    
    if (!address) {
        console.error("No address provided");
        return NextResponse.json(
            { error: "Address parameter is required" },
            { status: 400 }
        );
    }

    console.log(`Executing Address Funding Info Query for address: ${address}`);

    let session;

    try {
        const driver = await getDriver();
        session = driver.session();
        
        // Query to get all refs proposed by the address
        const refsQuery = `
            MATCH (source)-[p:PROPOSED]->(target)
            WHERE source.wallet_address = $address
            RETURN target.id as id, 
                   target.requested as requested, 
                   target.status as status
            ORDER BY target.id
        `;

        // Query to get funding amounts by category for the address
        const fundingQuery = `
            MATCH (source)-[p:PROPOSED]->(target)
            WHERE source.wallet_address = $address
            AND target.status = 'Executed'
            AND any(label IN labels(target) WHERE label IN ['BD', 'Compensation', 'EducationAndResearch', 'Event', 'Existing', 'Marketing', 'New', 'Product', 'Protocol', 'Security'])
            UNWIND labels(target) as label
            WITH label, target.id as nodeId, target.requested as requested
            WHERE label IN ['BD', 'Compensation', 'EducationAndResearch', 'Event', 'Existing', 'Marketing', 'New', 'Product', 'Protocol', 'Security']
            AND requested IS NOT NULL
            AND requested <> -1
            WITH label as categoryName, 
                 collect({nodeId: nodeId, requested: toFloat(requested)}) as refData
            UNWIND refData as ref
            WITH categoryName, 
                 sum(ref.requested) as totalAmount,
                 collect(ref.nodeId) as refIds
            RETURN categoryName, totalAmount, refIds
            ORDER BY categoryName
        `;

        // Query to get voting information for the address
        const votingQuery = `
            MATCH (voter)-[v:VOTED]->(ref)
            WHERE voter.wallet_address = $address
            UNWIND labels(ref) as label
            WITH ref.id as refId, 
                 v.votingPower as power, 
                 v.decision as decision,
                 collect(DISTINCT label) as categories
            WHERE any(cat IN categories WHERE cat IN ['BD', 'Compensation', 'EducationAndResearch', 'Event', 'Existing', 'Marketing', 'New', 'Product', 'Protocol', 'Security'])
            WITH refId, power, decision, [cat IN categories WHERE cat IN ['BD', 'Compensation', 'EducationAndResearch', 'Event', 'Existing', 'Marketing', 'New', 'Product', 'Protocol', 'Security']] as filteredCategories
            RETURN refId, filteredCategories as category, power, decision
            ORDER BY refId
        `;

        const refsResult = await session.executeRead((tx) => tx.run(refsQuery, { address }));
        const fundingResult = await session.executeRead((tx) => tx.run(fundingQuery, { address }));
        const votingResult = await session.executeRead((tx) => tx.run(votingQuery, { address }));

        // Transform refs data
        const totalRefs = refsResult.records.map((record) => {
            const obj = record.toObject();
            return {
                id: typeof obj.id === 'object' ? obj.id.low : obj.id,
                requested: typeof obj.requested === 'object' ? obj.requested.low / Math.pow(10, 10) : (obj.requested / Math.pow(10, 10) || 0),
                status: obj.status || 'Unknown'
            };
        });

        // Transform funding data
        const funding = fundingResult.records.map((record) => {
            const obj = record.toObject();
            
            // Properly convert totalAmount to number before dividing
            let totalAmount = obj.totalAmount;
            if (typeof totalAmount === 'object' && totalAmount.low !== undefined) {
                totalAmount = totalAmount.low;
            }
            totalAmount = Number(totalAmount);
            
            return {
                category: obj.categoryName,
                amount: totalAmount / Math.pow(10, 10), // Convert to standard units
                refs: obj.refIds.map((id: number | { low: number; high: number }) => typeof id === 'object' ? id.low : id)
            };
        });

        // Transform voting data
        const voting = votingResult.records.map((record) => {
            const obj = record.toObject();
            
            // Convert power to number if it's an object
            let power = obj.power;
            if (typeof power === 'object' && power.low !== undefined) {
                power = power.low;
            }
            power = Number(power);
            
            return {
                refId: typeof obj.refId === 'object' ? obj.refId.low : obj.refId,
                category: obj.category || [],
                power: power,
                decision: obj.decision as "AYE" | "NAY" | "ABSTAIN"
            };
        });

        const result: AddressInfo = {
            address,
            totalRefs,
            funding,
            voting
        };

        console.log(`Address Funding Info query completed successfully for ${address} with ${totalRefs.length} refs, ${funding.length} categories, and ${voting.length} votes`);
        
        return NextResponse.json({ data: result });
    } catch (error) {
        console.error("Error in Address Funding Info query execution:", error);
        return NextResponse.json(
            { error: "Failed to fetch Address Funding Info data", details: String(error) },
            { status: 500 }
        );
    } finally {
        if (session) {
            try {
                await session.close();
                console.log("Address Funding Info session closed");
            } catch (e) {
                console.error("Error closing session:", e);
            }
        }
    }
}