import { NextRequest, NextResponse } from "next/server";
import { DuneClient } from "@duneanalytics/client-sdk";

const DUNE_API_KEY = process.env.DUNE_API_KEY;

export async function POST(req: NextRequest) {
  const { queryId } = await req.json();

  if (!DUNE_API_KEY) {
    return NextResponse.json(
      { error: "DUNE_API_KEY is not set" },
      { status: 500 }
    );
  }
  const dune = new DuneClient(DUNE_API_KEY);
  const query_result = await dune.getLatestResult({
    queryId: queryId,
    opts: { batchSize: 1000 },
  });
  if (query_result.error) {
    return NextResponse.json({ error: query_result.error }, { status: 500 });
  }
  return NextResponse.json({ data: query_result.result?.rows });
}
