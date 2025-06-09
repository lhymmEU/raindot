interface InitiativeType {
    category: "New" | "Existing" | "Compensation" | "Protocol";
    amount: number;
    refs: number[];
}

interface FunctionalType {
    category: "Marketing" | "Product" | "Event" | "EducationAndResearch" | "BD" | "Security";
    amount: number;
    refs: number[];
}

import { NextResponse } from "next/server";
import { getDriver } from "@/lib/driverStore";

export async function GET() {
    console.log("Executing Treasury Outflow query");

    let session;

    try {
        const driver = await getDriver();
        session = driver.session();
        
        // Query to get data for InitiativeType categories
        const initiativeQuery = `MATCH (node)
                        WHERE node.status = 'Executed'
                        AND node.requested IS NOT NULL
                        AND node.requested <> -1
                        UNWIND labels(node) as label
                        WITH label, node.id as nodeId, node.requested as requested
                        WHERE label IN ['New', 'Existing', 'Compensation', 'Protocol']
                        WITH label as category, 
                             collect(DISTINCT {nodeId: nodeId, requested: requested}) as nodes
                        UNWIND nodes as node
                        WITH category, 
                             sum(toFloat(node.requested)) as totalAmount,
                             collect(node.nodeId) as refIds
                        RETURN category, totalAmount, refIds
                        ORDER BY category`;

        // Query to get data for FunctionalType categories
        const functionalQuery = `MATCH (node)
                        WHERE node.status = 'Executed'
                        AND node.requested IS NOT NULL
                        AND node.requested <> -1
                        UNWIND labels(node) as label
                        WITH label, node.id as nodeId, node.requested as requested
                        WHERE label IN ['Marketing', 'Product', 'Event', 'EducationAndResearch', 'BD', 'Security']
                        WITH label as category, 
                             collect(DISTINCT {nodeId: nodeId, requested: requested}) as nodes
                        UNWIND nodes as node
                        WITH category, 
                             sum(toFloat(node.requested)) as totalAmount,
                             collect(node.nodeId) as refIds
                        RETURN category, totalAmount, refIds
                        ORDER BY category`;

        const initiativeRes = await session.executeRead((tx) => tx.run(initiativeQuery));
        const functionalRes = await session.executeRead((tx) => tx.run(functionalQuery));

        // Transform the initiative data
        const rawInitiativeData = initiativeRes.records.map((record) => record.toObject());
        const initiativeData: InitiativeType[] = rawInitiativeData.map((record) => {
            const { category, totalAmount, refIds } = record;
            return {
                category: category as "New" | "Existing" | "Compensation" | "Protocol",
                amount: totalAmount / Math.pow(10, 10), // Divide by 10^10 as requested
                refs: refIds
            };
        });

        // Transform the functional data
        const rawFunctionalData = functionalRes.records.map((record) => record.toObject());
        const functionalData: FunctionalType[] = rawFunctionalData.map((record) => {
            const { category, totalAmount, refIds } = record;
            return {
                category: category as "Marketing" | "Product" | "Event" | "EducationAndResearch" | "BD" | "Security",
                amount: totalAmount / Math.pow(10, 10), // Divide by 10^10 as requested
                refs: refIds
            };
        });

        console.log(`Treasury Outflow query completed successfully with ${initiativeData.length} initiative results and ${functionalData.length} functional results`);
        
        return NextResponse.json({ 
            initiativeData: initiativeData,
            functionalData: functionalData
        });
    } catch (error) {
        console.error("Error in Treasury Outflow query execution:", error);
        return NextResponse.json(
            { error: "Failed to fetch Treasury Outflow data", details: String(error) },
            { status: 500 }
        );
    } finally {
        if (session) {
            try {
                await session.close();
                console.log("Treasury Outflow session closed");
            } catch (e) {
                console.error("Error closing session:", e);
            }
        }
    }
}