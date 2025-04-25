import Header from "@/app/components/header";
import Hero from "@/app/components/hero";
import Footer from "@/app/components/footer";
import VoterChart from "@/app/openvis/voter-chart";

export const dynamic = 'force-dynamic'; // Prevent static generation
const baseUrl = "http://localhost:3000"
// const baseUrl = "https://raindot.vercel.app";

export default async function OpenVis() {
  let voterData = { data: [] };

  try {
    // Fetch for the voter count trends, queryId is 5000878
    const voterResponse = await fetch(`${baseUrl}/api/dune`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ queryId: 5000878 }),
    });

    if (!voterResponse.ok) throw new Error(`Error: ${voterResponse.status}`);
    voterData = await voterResponse.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    // Continue with empty data instead of crashing
  }

  return (
    <>
      <Header />
      <Hero
        title="OpenVis"
        description="Visualizing OpenGov data."
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Voter Count Trends</h1>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <VoterChart data={voterData.data} />
        </div>
      </div>
      <Footer />
    </>
  );
}
