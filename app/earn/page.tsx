import Header from "@/app/components/header";
import Hero from "@/app/components/hero";
import Footer from "@/app/components/footer";
import Search from "@/app/components/search";
import { EarnCardList } from "@/app/components/earn-card-list";

export default function Earn() {
  const opportunities = [
    {
      title: "MEETUPS BOUNTY",
      tags: ["Non-technical", "On-chain treasury"],
      description: "Organise a quick meetup and get hassle free funding"
    },
    {
      title: "WEB3 FOUNDATION GRANTS",
      tags: ["Technical", "Grants"],
      description: "Developing a project? Coming here from a hackathon?  Check out Web3 Foundation grants"
    },
    {
      title: "OG RUST BOUNTY",
      tags: ["Technical", "On-chain treasury"],
      description: "RFPs for specific rust/Polkadot SDK tasks in the ecosystem"
    }
  ];
  
  return (
    <>
      <Header />
      <Hero
        title="EARN"
        description="There are various ways to obtain funding. These are divided into technical, more geared towards developers and non-technical ones which are dedicated to non developer contributors."
      />
      <Search />
      <div className="px-[82px] py-[32px] font-[400] text-[24px]">
        <p>Funding mechanisms are separated into: on-chain (treasury and bounties), grants and bug bounty programs. Most non-technical funding is on-chain, while others will include development.</p>
      </div>
      <EarnCardList opportunities={opportunities} />
      <Footer />
    </>
  );
}
