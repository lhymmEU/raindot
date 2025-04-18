import { NextResponse } from 'next/server';
import { DuneClient } from '@duneanalytics/client-sdk';

const DUNE_API_KEY = process.env.DUNE_API_KEY;

export async function GET() {
  if (!DUNE_API_KEY) {
    return NextResponse.json({ error: 'DUNE_API_KEY is not set' }, { status: 500 });
  }
  const dune = new DuneClient(DUNE_API_KEY);
  const query_result = await dune.getLatestResult({queryId: 5000878});
  if (query_result.error) {
    return NextResponse.json({ error: query_result.error }, { status: 500 });
  }
  return NextResponse.json({ data: query_result.result?.rows });
}