import { NextResponse } from "next/server";
import { getDriver } from "@/lib/driverStore";

export async function GET() {
  console.log("Executing Ref Voting Power Turnout query");
  
  let session;

  try {
    const driver = await getDriver();
    session = driver.session();
    
    const query = `MATCH (ref:Ref)<-[v:VOTED]-(:Voter)
                  RETURN 
                    ref.id AS id,
                    ref.title AS title,
                    COUNT(v) AS voteCounts,
                    SUM(v.votingPower) AS totalVotingPowerTurnout
                  ORDER BY totalVotingPowerTurnout DESC`;
    
    const res = await session.executeWrite((tx) => {
      return tx.run(query);
    });

    // Return only the actual data, stripping the metadata
    const data = res.records.map((record) => record.toObject());
    console.log(`Ref Voting Power Turnout query completed successfully with ${data.length} results`);
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in Ref Voting Power Turnout query execution:", error);
    return NextResponse.json(
      { error: "Failed to fetch Ref Voting Power Turnout data", details: String(error) },
      { status: 500 }
    );
  } finally {
    if (session) {
      try {
        await session.close();
        console.log("Ref Voting Power Turnout session closed");
      } catch (e) {
        console.error("Error closing session:", e);
      }
    }
  }
} 