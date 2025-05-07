import Header from "@/app/components/header";
import Hero from "@/app/components/hero";
import GrantCardGrid from "@/app/components/grant-card-grid";
import Footer from "@/app/components/footer";
import ToggleGrantList from "../components/toggle-grant-list";

export default function Earn() {
  const cards = [
    {
      imageUrl: "/img-placeholder.svg?height=200&width=400",
      title: "DOTPLAY BOUNTY",
      subtitle: "Funding For Gaming Projects",
      buttonText: "VIEW",
      href: "#",
    },
    {
      imageUrl: "/img-placeholder.svg?height=200&width=400",
      title: "JOB BOARD",
      subtitle: "Tasks For Everyone",
      buttonText: "VIEW",
      href: "#",
    },
    {
      imageUrl: "/img-placeholder.svg?height=200&width=400",
      title: "EVENTS BOUNTY",
      subtitle: "Financing For Events",
      buttonText: "VIEW",
      href: "#",
    },
  ];

  const technicalCards = [
    {
      imageUrl: "/img-placeholder.svg?height=200&width=400",
      title: "DOTPLAY BOUNTY",
      subtitle: "Funding For Gaming Projects",
      buttonText: "VIEW",
      href: "#",
    },
    {
      imageUrl: "/img-placeholder.svg?height=200&width=400",
      title: "JOB BOARD",
      subtitle: "Tasks For Everyone",
      buttonText: "VIEW",
      href: "#",
    },
    {
      imageUrl: "/img-placeholder.svg?height=200&width=400",
      title: "EVENTS BOUNTY",
      subtitle: "Financing For Events",
      buttonText: "VIEW",
      href: "#",
    },
    {
      imageUrl: "/img-placeholder.svg?height=200&width=400",
      title: "DOTPLAY BOUNTY",
      subtitle: "Funding For Gaming Projects",
      buttonText: "VIEW",
      href: "#",
    },
    {
      imageUrl: "/img-placeholder.svg?height=200&width=400",
      title: "JOB BOARD",
      subtitle: "Tasks For Everyone",
      buttonText: "VIEW",
      href: "#",
    },
    {
      imageUrl: "/img-placeholder.svg?height=200&width=400",
      title: "EVENTS BOUNTY",
      subtitle: "Financing For Events",
      buttonText: "VIEW",
      href: "#",
    },
  ];

  return (
    <>
      <Header />
      <Hero
        title="EARN"
        description="There are various ways to obtain funding. These are divided into technical, more geared towards developers and non-technical ones which are dedicated to non developer contributors."
      />
      <div className="border-y border-black px-[68px] py-[40px]">
        <h1 className="text-[80px] font-[700]">HIGHLIGHTS</h1>
      </div>
      <GrantCardGrid cards={cards} />
      <div className="border-b border-black px-[68px] py-[40px]">
        <h1 className="text-[80px] font-[700]">BOUNTIES</h1>
      </div>
      <div className="border-b border-black px-[68px] py-[40px]">
        <h1 className="text-[30px] font-[400]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </h1>
      </div>
      <ToggleGrantList listName="Technical" cards={technicalCards} />
      <ToggleGrantList listName="Non-Technical" cards={technicalCards} />
      <ToggleGrantList listName="Grant Programs" cards={technicalCards} />
      <ToggleGrantList listName="Ecosystem Grants" cards={technicalCards} />
      <ToggleGrantList listName="On-Chain Treasury" cards={technicalCards} />
      <Footer />
    </>
  );
}
