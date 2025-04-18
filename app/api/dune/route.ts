import { NextResponse } from 'next/server';

const DUNE_API_KEY = process.env.DUNE_API_KEY;

export async function GET() {
  try {
    const response = await fetch(
      "https://api.dune.com/api/v1/query/4995821/results?limit=1000",
      {
        headers: {
          "X-Dune-API-Key": DUNE_API_KEY || '',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json({ data: data.result.rows});
  } catch (error) {
    console.error('Error fetching Dune data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Dune API' },
      { status: 500 }
    );
  }
}