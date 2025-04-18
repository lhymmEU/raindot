import Header from "@/app/components/header";
import Hero from "@/app/components/hero";
import Footer from "@/app/components/footer";
import VoterChart from "@/app/openvis/voter-chart";

export const dynamic = 'force-dynamic'; // Prevent static generation
//const baseUrl = "http://localhost:3000"
const baseUrl = "https://raindot.vercel.app";

export default async function OpenVis() {
  
  let data = { data: [] };
  
  try {
    const response = await fetch(`${baseUrl}/api/dune`);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    data = await response.json();
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
          <VoterChart data={data.data} />
        </div>
      </div>
      <Footer />
    </>
  );
}
