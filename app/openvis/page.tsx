"use client";

import Header from "@/app/components/header";
import Hero from "@/app/components/hero";
import Footer from "@/app/components/footer";
import { MonthlyRefs, ProposeRel } from "./monthly-refs";
import { ActiveVoters, Voter } from "./active-voters";
import { useEffect, useState } from "react";

//const baseUrl = "http://localhost:3000";
const baseUrl = "https://raindot.vercel.app";

export default function OpenVis() {
  const [proposedData, setProposedData] = useState<ProposeRel[]>([]);
  const [votersData, setVotersData] = useState<Voter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch proposed referendums data
        const refsRes = await fetch(`${baseUrl}/api/graph`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query:
              "MATCH ()-[rel:PROPOSED]->() RETURN { timestamp: rel.timestamp } AS rel",
          }),
        });
        const refsResult = await refsRes.json();
        
        // Fetch voters data
        const votersRes = await fetch(`${baseUrl}/api/graph`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `MATCH (v:Voter)-[:VOTED]->()
                    RETURN 
                      v.wallet_address AS wallet_address,
                      v.display_name AS name,
                      COUNT(*) AS vote_count
                    ORDER BY vote_count DESC
                    LIMIT 15`,
          }),
        });
        const votersResult = await votersRes.json();
        
        if (refsResult && refsResult.data) {
          setProposedData(refsResult.data);
        }
        
        if (votersResult && votersResult.data) {
          setVotersData(votersResult.data);
        }
        
        if (!refsResult?.data || !votersResult?.data) {
          setError("Received invalid data format");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <Hero title="OpenVis" description="Visualizing OpenGov data." />
      <div className="py-[50px] px-[68px]">
        {loading ? (
          <p>Loading data...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <>
            <MonthlyRefs data={proposedData} />
            <ActiveVoters data={votersData} />
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
