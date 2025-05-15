import { NextResponse } from "next/server";
import { getDriver } from "@/lib/driverStore";

export async function GET() {
  console.log("Executing Fortune Teller query");
  
  let session;

  try {
    const driver = await getDriver();
    session = driver.session();
    
    const query = `MATCH (voter:Voter)-[votes:VOTED]->(r:Ref)
                  WITH voter,
                       COUNT(votes) AS totalVotes,
                       SUM(
                         CASE 
                           WHEN votes.decision = 'AYE' AND r.status = 'Executed' THEN 1
                           WHEN votes.decision = 'NAY' AND r.status <> 'Executed' THEN 1
                           ELSE 0
                         END
                       ) AS correctVotes
                  WHERE totalVotes > 0
                  RETURN
                    voter.wallet_address AS walletAddress,
                    voter.display_name AS name,
                    toInteger(totalVotes) AS totalVotes,
                    toInteger(correctVotes) AS correctVotes
                  ORDER BY correctVotes / totalVotes DESC`;
    
    const res = await session.executeWrite((tx) => {
      return tx.run(query);
    });

    // Return only the actual data, stripping the metadata
    const data = res.records.map((record) => record.toObject());
    console.log(`Fortune Teller query completed successfully with ${data.length} results`);
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in Fortune Teller query execution:", error);
    return NextResponse.json(
      { error: "Failed to fetch Fortune Teller data", details: String(error) },
      { status: 500 }
    );
  } finally {
    if (session) {
      try {
        await session.close();
        console.log("Fortune Teller session closed");
      } catch (e) {
        console.error("Error closing session:", e);
      }
    }
  }
} 