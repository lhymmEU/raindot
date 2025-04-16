import Header from "@/app/components/header"
import Hero from "@/app/components/hero"
import CardGrid from "@/app/components/card-grid"
import ChatSection from "@/app/components/chat-section"
import Footer from "@/app/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow">
        <Hero />
        <CardGrid />
        <ChatSection />
      </main>
      <Footer />
    </div>
  )
}
