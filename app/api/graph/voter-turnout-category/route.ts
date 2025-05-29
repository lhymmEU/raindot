import { NextResponse } from "next/server";
import { getDriver } from "@/lib/driverStore";

export async function GET() {
  console.log("Executing Voter Turnout Category query");
  
  let session;

  try {
    const driver = await getDriver();
    session = driver.session();
    
    const query = `MATCH (ref:Ref)<-[v:VOTED]-()
                    WITH ref, count(v) as vote_count
                    UNWIND labels(ref) as label
                    WITH label, vote_count WHERE label IN ['BD', 'Compensation', 'EducationAndResearch', 'Error', 'Event', 'Existing', 'Marketing', 'New', 'Product', 'Protocol', 'Security']
                    RETURN label as category, sum(vote_count) as total_votes
                    ORDER BY total_votes DESC`;

    const res = await session.executeWrite((tx) => {
      return tx.run(query);
    });

    // Return only the actual data, stripping the metadata
    const data = res.records.map((record) => record.toObject());
    console.log(`Voter Turnout Category query completed successfully with ${data.length} results`);
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in Voter Turnout Category query execution:", error);
    return NextResponse.json(
      { error: "Failed to fetch Voter Turnout Category data", details: String(error) },
      { status: 500 }
    );
  } finally {
    if (session) {
      try {
        await session.close();
        console.log("Voter Turnout Category session closed");
      } catch (e) {
        console.error("Error closing session:", e);
      }
    }
  }
}
