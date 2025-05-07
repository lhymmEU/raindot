import Footer from "@/app/components/footer";
import Header from "@/app/components/header";
import Hero from "@/app/components/hero";
import CardGrid from "@/app/components/card-grid-three";
export default function Build() {
  const cards = [
    {
      title: "DOCS",
      description: "BUILD NOW",
      imageUrl: "/temp.png",
      buttonLink: "/temp",
    },
    {
      title: "STACK XCHANGE",
      description: "GOT STUCK?",
      imageUrl: "/temp.png",
      buttonLink: "/temp",
    },
    {
      title: "SUPPORT",
      description: "GENERAL INFO",
      imageUrl: "/temp.png",
      buttonLink: "/temp",
    },
  ];
  return (
    <div>
      <Header />
      <Hero
        title="BUILD"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod"
      />
      <CardGrid cards={cards} />
      <Footer />
    </div>
  );
}
