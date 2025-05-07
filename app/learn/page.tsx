import CardGrid from "@/app/components/card-grid-two";
import Footer from "@/app/components/footer";
import Header from "@/app/components/header";
import Hero from "@/app/components/hero";

export default function Learn() {
  const cards = [
    {
      title: "GET STARTED",
      description: "BUILD NOW",
      imageUrl: "/temp.png",
      buttonLink: "/temp",
    },
    {
      title: "W3F SUPPORT",
      description: "GOT STUCK?",
      imageUrl: "/temp.png",
      buttonLink: "/temp",
    },
    {
      title: "ON/OFF RAMP",
      description: "BUILD NOW",
      imageUrl: "/temp.png",
      buttonLink: "/temp",
    },
    {
      title: "PBA",
      description: "FORMAL EDUCATION",
      imageUrl: "/temp.png",
      buttonLink: "/temp",
    },
  ];
  return (
    <div>
      <Header />
      <Hero
        title="LEARN"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod"
      />
      <CardGrid cards={cards} />
      <Footer />
    </div>
  );
}
