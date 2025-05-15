import { NextRequest, NextResponse } from "next/server";
import { getDriver } from "@/lib/driverStore";

// Fetch data from neo4j
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { query } = body;
  
  if (!query) {
    console.error("No query provided");
    return NextResponse.json(
      { error: "No query provided" },
      { status: 400 }
    );
  }
  
  console.log("Executing Neo4j query:", query.substring(0, 100) + (query.length > 100 ? "..." : ""));
  
  let session;

  try {
    const driver = await getDriver();
    session = driver.session();
    
    const res = await session.executeWrite((tx) => {
      return tx.run(query);
    });

    // Return only the actual data, stripping the metadata
    const data = res.records.map((record) => record.toObject());
    console.log(`Query completed successfully with ${data.length} results`);
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in Neo4j query execution:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from Neo4j", details: String(error) },
      { status: 500 }
    );
  } finally {
    if (session) {
      try {
        await session.close();
        console.log("Generic graph API session closed");
      } catch (e) {
        console.error("Error closing session:", e);
      }
    }
  }
}
