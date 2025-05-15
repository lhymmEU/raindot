import { initDriver } from "@/lib/neo4jHandler";
import { NextRequest, NextResponse } from "next/server";

// Fetch data from neo4j
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { query } = body;
  let driver;

  try {
    driver = await initDriver();
  } catch (error) {
    console.error("Error initializing driver:", error);
    return NextResponse.json(
      { error: "Failed to initialize Neo4j driver" },
      { status: 500 }
    );
  }
  const session = driver.session();

  try {
    const res = await session.executeWrite((tx) => {
      return tx.run(query);
    });

    // Return only the actual data, stripping the metadata
    return NextResponse.json({ data: res.records.map((record) => record.toObject()) });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from Neo4j" },
      { status: 500 }
    );
  } finally {
    await session.close();
    await driver.close();
  }
}
