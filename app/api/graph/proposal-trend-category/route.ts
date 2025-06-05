import { NextResponse } from "next/server";
import { getDriver } from "@/lib/driverStore";

export async function GET() {
    console.log("Executing Proposal Trend Category Query");

    let session;

    try {
        const driver = await getDriver();
        session = driver.session();
        
        const query = `MATCH (source)-[p:PROPOSED]->(target)
                        WHERE any(label IN labels(target) WHERE label IN ['BD', 'Compensation', 'EducationAndResearch', 'Event', 'Existing', 'Marketing', 'New', 'Product', 'Protocol', 'Security'])
                        UNWIND labels(target) as label
                        WITH label, target.id as nodeId, p.timestamp as timestamp 
                        WHERE label IN ['BD', 'Compensation', 'EducationAndResearch', 'Event', 'Existing', 'Marketing', 'New', 'Product', 'Protocol', 'Security']
                        WITH label as categoryName, nodeId, timestamp,
                             date(datetime(timestamp)).year + "-" + 
                             (CASE WHEN date(datetime(timestamp)).month < 10 THEN "0" ELSE "" END) + 
                             date(datetime(timestamp)).month as monthName
                        WITH categoryName, monthName, collect(nodeId) as nodeIds
                        RETURN categoryName, monthName, size(nodeIds) as count
                        ORDER BY categoryName, monthName`;

        const res = await session.executeWrite((tx) => {
            return tx.run(query);
        });

        // Transform the data into the requested format
        const rawData = res.records.map((record) => record.toObject());
        
        // Helper function to convert month number to month name with year
        const getMonthNameWithYear = (monthStr: string) => {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const [year, monthNum] = monthStr.split('-');
            const month = parseInt(monthNum) - 1; // Convert to 0-based index
            return `${year}-${monthNames[month]}`;
        };

        // Group data by category and convert to requested format
        const transformedData: { [categoryName: string]: { [month: string]: number } } = {};
        
        rawData.forEach((record) => {
            const { categoryName, monthName, count } = record;
            const monthNameWithYear = getMonthNameWithYear(monthName);
            
            if (!transformedData[categoryName]) {
                transformedData[categoryName] = {};
            }
            
            transformedData[categoryName][monthNameWithYear] = count.low;
        });

        console.log(`Proposal Trend Category query completed successfully with ${rawData.length} results`);
        // console.log("The transformed results for proposal trend category are: ", transformedData);
        
        return NextResponse.json({ data: transformedData });
    } catch (error) {
        console.error("Error in Proposal Trend Category query execution:", error);
        return NextResponse.json(
            { error: "Failed to fetch Proposal Trend Category data", details: String(error) },
            { status: 500 }
        );
    } finally {
        if (session) {
            try {
                await session.close();
                console.log("Proposal Trend Category session closed");
            } catch (e) {
                console.error("Error closing session:", e);
            }
        }
    }
}