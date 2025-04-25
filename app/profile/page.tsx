import Header from "@/app/components/header";
import Hero from "@/app/components/hero";
import Footer from "@/app/components/footer";
import { ProfileCard } from "@/app/components/profile";

export default function Profile() {
  const profileData = {
    Name: "Polkadot Blockchain Academy (PBA)",
    Description: {
      Leaders: ["Pauline Cohen Vorms"],
      "Site/Hub": "https://polkadot.academy/",
      State: "Active",
      Relations: [],
      Since: 2021,
      To: 0,
      Category: "Learning Platform",
      Structure: "Team",
      Size: 0,
    },
    Funding: {
      Total: 10000000,
      "DOT Address": "16W7xmgxqZr7n1eqt6acZ8TtAbXybJZi3k51y4qDCjzgVY4j",
      Sources: ["#179", "#375", "#584", "#943", "#1125", "#1497"],
    },
    Content: {
      Purpose: "Education",
      Class: ["Course"],
      Formats: ["Workshops", "Hackathons", "Seminars", "Long-form Videos"],
    },
    Distribution: {
      "M. Platforms": ["IRL"],
      "S. Platforms": ["Site", "X", "YouTube"],
      "Funnel Lv1": ["Polkadot/JAM (1)"],
      Audience: ["Students", "Developers"],
      Language: ["English"],
      Geographic: ["Worldwide"],
      chats: [],
      Members: 0,
    },
    Outcomes: {
      Deliverables: [
        "IRL education programs: PBA 1,2,3,4,5,6 & 7",
        "Online education courses: PBA-X",
        "PBA Derived resources (slides, articles, etc.)",
        "Several YT videos & posts in X derived from PBA activity",
      ],
      Impact: ["XXX graduated students"],
      "Reach Source": [],
      "Strategic Impact": [],
      Reports: [],
    },
    Evaluation: {
      Strengths: [
        "It is the most comprehensive and recognized educational initiative in the ecosystem.",
      ],
      Opportunities: [
        "The program benefits from access to highly qualified instructors, a resource that is both critical and scarce in the current landscape.",
        "The online version of PBA-X recently launched could scale significantly with the right growth strategy in place.",
      ],
      Challenges: [
        "The educational platform doesn't have a free preview with access to limited content.",
        "There are no well-defined formal content series on the YT channel.",
      ],
      Notes: [],
    },
  };
  return (
    <>
      <Header />
      <Hero
        title="Profile"
        description="Detailed profiles of ecosystem participants."
      />
      <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gray-50">
        <ProfileCard data={profileData} />
      </div>
      <Footer />
    </>
  );
}
