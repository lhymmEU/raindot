import { NextResponse } from "next/server";
import { getDriver } from "@/lib/driverStore";

export async function GET() {
    console.log("Executing Approval Rate Category Query");

    let session;

    try {
        const driver = await getDriver();
        session = driver.session();
        
        const query = `MATCH (source)-[p:PROPOSED]->(target)
                        WHERE any(label IN labels(target) WHERE label IN ['BD', 'Compensation', 'EducationAndResearch', 'Event', 'Existing', 'Marketing', 'New', 'Product', 'Protocol', 'Security'])
                        UNWIND labels(target) as label
                        WITH label, target.id as nodeId, target.status as status
                        WHERE label IN ['BD', 'Compensation', 'EducationAndResearch', 'Event', 'Existing', 'Marketing', 'New', 'Product', 'Protocol', 'Security']
                        WITH label as categoryName, 
                             count(DISTINCT nodeId) as totalCount,
                             count(DISTINCT CASE WHEN status = 'Executed' THEN nodeId END) as executedCount
                        RETURN categoryName, totalCount, executedCount,
                               CASE WHEN totalCount > 0 THEN toFloat(executedCount) / toFloat(totalCount) ELSE 0.0 END as approvalRate
                        ORDER BY categoryName`;

        const res = await session.executeWrite((tx) => {
            return tx.run(query);
        });

        // Transform the data into the requested format
        const rawData = res.records.map((record) => record.toObject());
        
        // Convert to a simple object with category names as keys and approval rates as values
        const transformedData: { [categoryName: string]: number } = {};
        
        rawData.forEach((record) => {
            const { categoryName, approvalRate } = record;
            transformedData[categoryName] = approvalRate;
        });

        console.log(`Approval Rate Category query completed successfully with ${rawData.length} results`);
        // console.log("The transformed results for approval rate category are: ", transformedData);
        
        return NextResponse.json({ data: transformedData });
    } catch (error) {
        console.error("Error in Approval Rate Category query execution:", error);
        return NextResponse.json(
            { error: "Failed to fetch Approval Rate Category data", details: String(error) },
            { status: 500 }
        );
    } finally {
        if (session) {
            try {
                await session.close();
                console.log("Approval Rate Category session closed");
            } catch (e) {
                console.error("Error closing session:", e);
            }
        }
    }
}
