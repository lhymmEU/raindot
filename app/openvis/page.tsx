import Header from "@/app/components/header";
import Hero from "@/app/components/hero";
import Footer from "@/app/components/footer";
import { MonthlyRefs } from "./monthly-refs";
import { ActiveVoters } from "./active-voters";

const baseUrl = "http://localhost:3000";
// const baseUrl = "https://raindot.vercel.app";

export default function OpenVis() {
  return (
    <>
      <Header />
      <Hero title="OpenVis" description="Visualizing OpenGov data." />
      <div className="py-[50px] px-[68px]">
        <MonthlyRefs baseUrl={baseUrl} />
        <ActiveVoters baseUrl={baseUrl} />
      </div>
      <Footer />
    </>
  );
}
