import CardGrid from "@/app/components/card-grid-two";
import Footer from "@/app/components/footer";
import Header from "@/app/components/header";
import Hero from "@/app/components/hero";

export default function Learn() {
  const cards = [
    {
      title: "GET STARTED",
      descriptionTop: "BUILD NOW",
      descriptionBottom: " ",
    },
    {
      title: "W3F SUPPORT",
      descriptionTop: "GOT STUCK?",
      descriptionBottom: "GET HELP",
    },
    {
      title: "ON/OFF RAMP",
      descriptionTop: "BUILD NOW",
      descriptionBottom: " ",
    },
    {
      title: "PBA",
      descriptionTop: "FORMAL",
      descriptionBottom: "EDUCATION",
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
