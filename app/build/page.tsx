import Footer from "@/app/components/footer";
import Header from "@/app/components/header";
import Hero from "@/app/components/hero";
import CardGrid from "@/app/components/card-grid-three";
export default function Build() {
  const cards = [
    {
      title: "DOCS",
      descriptionTop: "BUILD NOW",
      descriptionBottom: "",
      link: "#",
    },
    {
      title: "STACK XCHANGE",
      descriptionTop: "GOT STUCK?",
      descriptionBottom: "GET HELP",
      link: "#",
    },
    {
      title: "SUPPORT",
      descriptionTop: "GENERAL",
      descriptionBottom: "INFO",
      link: "#",
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
