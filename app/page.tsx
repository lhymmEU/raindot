import Header from "@/app/components/header";
import Hero from "@/app/components/hero";
import CardGrid from "@/app/components/card-grid-three";
import Footer from "@/app/components/footer";
import Banner from "./components/banner";

export default function Home() {
  const ecoCards = [
    {
      title: "JAM",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
      imageUrl: "/temp.png",
      buttonLink: "/jam",
    },
    {
      title: "LEARN",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
      imageUrl: "/temp.png",
      buttonLink: "/learn",
    },
    {
      title: "EARN",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
      imageUrl: "/temp.png",
      buttonLink: "/earn",
    },
    {
      title: "BUILD",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
      imageUrl: "/temp.png",
      buttonLink: "/build",
    },
    {
      title: "TITLE",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
      imageUrl: "/temp.png",
      buttonLink: "/title",
    },
    {
      title: "TITLE",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
      imageUrl: "/temp.png",
      buttonLink: "/title",
    },
  ];

  const chatCards = [
    {
      title: "POLKADOT DISCORD",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
      imageUrl: "/temp.png",
      buttonLink: "/temp",
    },
    {
      title: "JAM CHAT",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
      imageUrl: "/temp.png",
      buttonLink: "/temp",
    },
    {
      title: "WATERCOOLER",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
      imageUrl: "/temp.png",
      buttonLink: "/temp",
    },
    {
      title: "FORUM",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
      imageUrl: "/temp.png",
      buttonLink: "/temp",
    },
    {
      title: "POLKADOT OFFICIAL CHAT",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
      imageUrl: "/temp.png",
      buttonLink: "/temp",
    },
    {
      title: "TITLE",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
      imageUrl: "/temp.png",
      buttonLink: "/temp",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow">
        <Hero
          title="RAINDOTS"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod"
          buttonText="Get Started"
        />
        <Banner
          title="EXPLORE THE ECO"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod"
        />
        <CardGrid cards={ecoCards} />
        <Banner
          title="CHAT"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod"
        />
        <CardGrid cards={chatCards} />
      </main>
      <Footer />
    </div>
  );
}
