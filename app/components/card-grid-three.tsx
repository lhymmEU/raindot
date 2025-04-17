import Card from "@/app/components/card";

interface CardGridProps {
  cards: {
    title: string;
    descriptionTop: string;
    descriptionBottom: string;
    link: string;
  }[];
}

export default function CardGrid({ cards }: CardGridProps) {
  return (
    <section className="mx-auto px-4 py-[50px] px-[68px]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[28px] mx-auto">
        {cards.map((card, index) => (
          <Card key={index} title={card.title} descriptionTop={card.descriptionTop} descriptionBottom={card.descriptionBottom} link={card.link} />
        ))}
      </div>
    </section>
  )
}