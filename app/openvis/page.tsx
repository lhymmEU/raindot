"use client";

import Header from "@/app/components/header";
import Hero from "@/app/components/hero";
import Footer from "@/app/components/footer";
import { MonthlyRefs, ProposeRel } from "./monthly-refs";
import { ActiveVoters, Voter } from "./active-voters";
import { useEffect, useState } from "react";
import { RefVotingPowerTurnout } from "./ref-voting-power-turnout";

const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

export default function OpenVis() {
  const [proposedData, setProposedData] = useState<ProposeRel[]>([]);
  const [votersData, setVotersData] = useState<Voter[]>([]);
  const [refVotingPowerTurnoutData, setRefVotingPowerTurnoutData] = useState<
    RefVotingPowerTurnout[]
  >([]);
  const [refsLoading, setRefsLoading] = useState(true);
  const [votersLoading, setVotersLoading] = useState(true);
  const [refVotingPowerTurnoutLoading, setRefVotingPowerTurnoutLoading] =
    useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setRefsLoading(true);
      setVotersLoading(true);
      setRefVotingPowerTurnoutLoading(true);
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

        if (refsResult && refsResult.data) {
          setProposedData(refsResult.data);
          setRefsLoading(false);
        }

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

        if (votersResult && votersResult.data) {
          setVotersData(votersResult.data);
          setVotersLoading(false);
        }

        // Fetch referendum voting power turnout data
        const refVotingPowerTurnoutRes = await fetch(`${baseUrl}/api/graph`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `MATCH (ref:Ref)<-[v:VOTED]-(:Voter)
                    RETURN 
                      ref.id AS id,
                      ref.title AS title,
                      COUNT(v) AS voteCounts,
                      SUM(v.votingPower) AS totalVotingPowerTurnout
                    ORDER BY totalVotingPowerTurnout DESC`,
          }),
        });
        const refVotingPowerTurnoutResult =
          await refVotingPowerTurnoutRes.json();

        if (refVotingPowerTurnoutResult && refVotingPowerTurnoutResult.data) {
          setRefVotingPowerTurnoutData(refVotingPowerTurnoutResult.data);
        }

        if (
          !refsResult?.data ||
          !votersResult?.data ||
          !refVotingPowerTurnoutResult?.data
        ) {
          console.log("Received invalid data format");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        console.log("Failed to fetch data");
      } finally {
        setRefsLoading(false);
        setVotersLoading(false);
        setRefVotingPowerTurnoutLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      <Hero title="OpenVis" description="Visualizing OpenGov data." />
      <div className="py-[50px] px-[68px]">
        <div>
          {refsLoading ? (
            <p>Loading data...</p>
          ) : (
            <MonthlyRefs data={proposedData} />
          )}
          {votersLoading ? (
            <p>Loading data...</p>
          ) : (
            <ActiveVoters data={votersData} />
          )}
          {refVotingPowerTurnoutLoading ? (
            <p>Loading data...</p>
          ) : (
            <RefVotingPowerTurnout data={refVotingPowerTurnoutData} />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
