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
      link: "/jam",
    },
    {
      title: "BUILD",
      descriptionTop: "ONE LINER",
      descriptionBottom: "ONE LINER",
      link: "/build",
    },
    {
      title: "EARN",
      descriptionTop: "ONE LINER",
      descriptionBottom: "ONE LINER",
      link: "/earn",
    },
    {
      title: "LEARN",
      descriptionTop: "ONE LINER",
      descriptionBottom: "ONE LINER",
      link: "/learn",
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
        <CardGrid cards={cards} />
        <ChatSection />
      </main>
      <Footer />
    </div>
  );
}
