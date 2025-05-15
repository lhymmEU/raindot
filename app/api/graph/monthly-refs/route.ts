import { NextResponse } from "next/server";
import { getDriver } from "@/lib/driverStore";

export async function GET() {
  console.log("Executing Monthly Refs query");
  
  let session;

  try {
    const driver = await getDriver();
    session = driver.session();
    
    const query = "MATCH ()-[rel:PROPOSED]->() RETURN { timestamp: rel.timestamp } AS rel";
    
    const res = await session.executeWrite((tx) => {
      return tx.run(query);
    });

    // Return only the actual data, stripping the metadata
    const data = res.records.map((record) => record.toObject());
    console.log(`Monthly Refs query completed successfully with ${data.length} results`);
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in Monthly Refs query execution:", error);
    return NextResponse.json(
      { error: "Failed to fetch Monthly Refs data", details: String(error) },
      { status: 500 }
    );
  } finally {
    if (session) {
      try {
        await session.close();
        console.log("Monthly Refs session closed");
      } catch (e) {
        console.error("Error closing session:", e);
      }
    }
  }
} 