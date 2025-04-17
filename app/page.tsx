import Header from "@/app/components/header";
import Hero from "@/app/components/hero";
import CardGrid from "@/app/components/card-grid-two";
import ChatSection from "@/app/components/chat-section";
import Footer from "@/app/components/footer";

export default function Home() {
  const cards = [
    {
      title: "JAM",
      descriptionTop: "ONE LINER",
      descriptionBottom: "ONE LINER",
    },
    {
      title: "BUILD",
      descriptionTop: "ONE LINER",
      descriptionBottom: "ONE LINER",
    },
    {
      title: "EARN",
      descriptionTop: "ONE LINER",
      descriptionBottom: "ONE LINER",
    },
    {
      title: "LEARN",
      descriptionTop: "ONE LINER",
      descriptionBottom: "ONE LINER",
    },
  ];
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow">
        <Hero
          title="THE PORTAL"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod"
          buttonOneText="Get Started"
          buttonTwoText="Explore"
        />
        <CardGrid cards={cards} />
        <ChatSection />
      </main>
      <Footer />
    </div>
  );
}
