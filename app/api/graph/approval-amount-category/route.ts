import { NextResponse } from "next/server";
import { getDriver } from "@/lib/driverStore";

export async function GET() {
    console.log("Executing Approval Amount Category Query");

    let session;

    try {
        const driver = await getDriver();
        session = driver.session();
        
        const query = `MATCH (source)-[p:PROPOSED]->(target)
                        WHERE any(label IN labels(target) WHERE label IN ['BD', 'Compensation', 'EducationAndResearch', 'Event', 'Existing', 'Marketing', 'New', 'Product', 'Protocol', 'Security'])
                        AND target.status = 'Executed'
                        UNWIND labels(target) as label
                        WITH label, target.id as nodeId, target.requested as requested
                        WHERE label IN ['BD', 'Compensation', 'EducationAndResearch', 'Event', 'Existing', 'Marketing', 'New', 'Product', 'Protocol', 'Security']
                        WITH label as categoryName, 
                             collect(DISTINCT {nodeId: nodeId, requested: requested}) as nodes
                        UNWIND nodes as node
                        WITH categoryName, 
                             sum(toFloat(node.requested)) as totalAmount
                        RETURN categoryName, totalAmount
                        ORDER BY categoryName`;

        const res = await session.executeWrite((tx) => {
            return tx.run(query);
        });

        // Transform the data into the requested format
        const rawData = res.records.map((record) => record.toObject());
        
        // Convert to a simple object with category names as keys and approval amounts as values
        // Divide by 10^10 as requested
        const transformedData: { [categoryName: string]: number } = {};
        
        rawData.forEach((record) => {
            const { categoryName, totalAmount } = record;
            transformedData[categoryName] = totalAmount / Math.pow(10, 10);
        });

        console.log(`Approval Amount Category query completed successfully with ${rawData.length} results`);
        // console.log("The transformed results for approval amount category are: ", transformedData);
        
        return NextResponse.json({ data: transformedData });
    } catch (error) {
        console.error("Error in Approval Amount Category query execution:", error);
        return NextResponse.json(
            { error: "Failed to fetch Approval Amount Category data", details: String(error) },
            { status: 500 }
        );
    } finally {
        if (session) {
            try {
                await session.close();
                console.log("Approval Amount Category session closed");
            } catch (e) {
                console.error("Error closing session:", e);
            }
        }
    }
}
