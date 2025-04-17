import Card from "@/app/components/card";

interface CardGridProps {
  cards: {
    title: string;
    descriptionTop: string;
    descriptionBottom: string;
  }[];
}

export default function CardGrid({ cards }: CardGridProps) {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[28px] w-[868px] h-[868px] mx-auto">
        {cards.map((card, index) => (
          <Card key={index} title={card.title} descriptionTop={card.descriptionTop} descriptionBottom={card.descriptionBottom} />
        ))}
      </div>
    </section>
  )
}
