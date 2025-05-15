import { NextResponse } from "next/server";
import { getDriver } from "@/lib/driverStore";

export async function GET() {
  console.log("Executing Voting Power Inequality query");
  
  let session;

  try {
    const driver = await getDriver();
    session = driver.session();
    
    const query = `MATCH (v:Voter)-[vote:VOTED]->()
                  RETURN
                    v.wallet_address AS walletAddress,
                    v.display_name AS name,
                    SUM(vote.votingPower) AS totalVotingPower
                  ORDER BY totalVotingPower DESC`;
    
    const res = await session.executeWrite((tx) => {
      return tx.run(query);
    });

    // Return only the actual data, stripping the metadata
    const data = res.records.map((record) => record.toObject());
    console.log(`Voting Power Inequality query completed successfully with ${data.length} results`);
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in Voting Power Inequality query execution:", error);
    return NextResponse.json(
      { error: "Failed to fetch Voting Power Inequality data", details: String(error) },
      { status: 500 }
    );
  } finally {
    if (session) {
      try {
        await session.close();
        console.log("Voting Power Inequality session closed");
      } catch (e) {
        console.error("Error closing session:", e);
      }
    }
  }
}
