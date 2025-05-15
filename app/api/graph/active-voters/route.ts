import { NextResponse } from "next/server";
import { getDriver } from "@/lib/driverStore";

export async function GET() {
  console.log("Executing Active Voters query");
  
  let session;

  try {
    const driver = await getDriver();
    session = driver.session();
    
    const query = `MATCH (v:Voter)-[:VOTED]->()
                    RETURN 
                      v.wallet_address AS wallet_address,
                      v.display_name AS name,
                      COUNT(*) AS vote_count
                    ORDER BY vote_count DESC
                    LIMIT 15`;
    
    const res = await session.executeWrite((tx) => {
      return tx.run(query);
    });

    // Return only the actual data, stripping the metadata
    const data = res.records.map((record) => record.toObject());
    console.log(`Active Voters query completed successfully with ${data.length} results`);
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in Active Voters query execution:", error);
    return NextResponse.json(
      { error: "Failed to fetch Active Voters data", details: String(error) },
      { status: 500 }
    );
  } finally {
    if (session) {
      try {
        await session.close();
        console.log("Active Voters session closed");
      } catch (e) {
        console.error("Error closing session:", e);
      }
    }
  }
} 