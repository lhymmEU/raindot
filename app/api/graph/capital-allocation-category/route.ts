import { NextResponse } from "next/server";
import { getDriver } from "@/lib/driverStore";

export async function GET() {
  console.log("Executing Capital Allocation Category query");
  
  let session;

  try {
    const driver = await getDriver();
    session = driver.session();
    
    const query = `MATCH (node)
                    WHERE node.status = 'Executed'
                    AND node.requested IS NOT NULL
                    AND node.requested <> -1
                    UNWIND labels(node) as label
                    WITH label, node.requested as requested
                    WHERE label IN ['BD', 'Compensation', 'EducationAndResearch', 'Event', 'Existing', 'Marketing', 'New', 'Product', 'Protocol', 'Security']
                    RETURN label as category, sum(toFloat(requested)) / 10000000000.0 as total_allocation
                    ORDER BY total_allocation DESC`;

    const res = await session.executeWrite((tx) => {
      return tx.run(query);
    });

    // Return only the actual data, stripping the metadata
    const data = res.records.map((record) => record.toObject());
    console.log(`Capital Allocation Category query completed successfully with ${data.length} results`);
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in Capital Allocation Category query execution:", error);
    return NextResponse.json(
      { error: "Failed to fetch Capital Allocation Category data", details: String(error) },
      { status: 500 }
    );
  } finally {
    if (session) {
      try {
        await session.close();
        console.log("Capital Allocation Category session closed");
      } catch (e) {
        console.error("Error closing session:", e);
      }
    }
  }
}
