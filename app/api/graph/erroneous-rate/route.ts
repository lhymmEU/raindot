import { NextResponse } from "next/server";
import { getDriver } from "@/lib/driverStore";

export async function GET() {
  console.log("Executing Erroneous Rate query");
  
  let session;

  try {
    const driver = await getDriver();
    session = driver.session();
    
    const query = `MATCH (e:Error)<-[p:PROPOSED]-()
                    RETURN 
                      e.id AS id,
                      p.timestamp AS error_timestamp
                    ORDER BY e.timestamp ASC`;
    
    const countQuery = `MATCH ()-[p:PROPOSED]->()
                        RETURN
                            p.timestamp AS timestamp`;

    const res = await session.executeWrite((tx) => {
      return tx.run(query);
    });

    const countRes = await session.executeWrite((tx) => {
      return tx.run(countQuery);
    });

    // Return only the actual data, stripping the metadata
    const data = res.records.map((record) => record.toObject());
    const countData = countRes.records.map((record) => record.toObject());
    console.log(`Erroneous Rate query completed successfully with ${data.length} results`);
    
    return NextResponse.json({ data: {data, countData }});
  } catch (error) {
    console.error("Error in Erroneous Rate query execution:", error);
    return NextResponse.json(
      { error: "Failed to fetch Erroneous Rate data", details: String(error) },
      { status: 500 }
    );
  } finally {
    if (session) {
      try {
        await session.close();
        console.log("Erroneous Rate session closed");
      } catch (e) {
        console.error("Error closing session:", e);
      }
    }
  }
}
