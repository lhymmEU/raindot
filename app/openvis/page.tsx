"use client";

import Header from "@/app/components/header";
import Hero from "@/app/components/hero";
import Footer from "@/app/components/footer";
import { MonthlyRefs } from "./monthly-refs";
import { ActiveVoters } from "./active-voters";
import { RefVotingPowerTurnout } from "./ref-voting-power-turnout";
import { FortuneTeller } from "./fortune-teller";
import { getDriver } from "@/lib/driverStore";
import { useEffect } from "react";
import { VotingPowerInequality } from "./voting-power-inequality";
export default function OpenVis() {
  // Initialize the driver in useEffect to ensure it runs only on the client
  useEffect(() => {
    // Initialize the singleton driver
    getDriver()
      .then(() => {
        console.log("Driver initialized in page component");
      })
      .catch((error) => {
        console.error("Failed to initialize driver:", error);
      });
  }, []);

  return (
    <>
      <Header />
      <Hero title="OpenVis" description="Visualizing OpenGov data." />
      <div className="py-[50px] px-[68px]">
        <div className="flex flex-col gap-12">
          <section className="w-full">
            <MonthlyRefs />
          </section>
          
          <hr className="border-gray-200" />
          
          <section className="w-full">
            <ActiveVoters />
          </section>
          
          <hr className="border-gray-200" />
          
          <section className="w-full">
            <RefVotingPowerTurnout />
          </section>
          
          <hr className="border-gray-200" />
          <section className="w-full">
            <FortuneTeller />
          </section>

          <hr className="border-gray-200" />
          <section className="w-full">
            <VotingPowerInequality />
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
