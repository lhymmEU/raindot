import GrantCard, { GrantCardProps } from "@/app/components/grant-card";


interface CardGridProps {
  cards: GrantCardProps[];
}

export default function CardGrid({ cards }: CardGridProps) {
  return (
    <section className="mx-auto px-4 pt-[50px] px-[68px]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[28px] mx-auto">
        {cards.map((card, index) => (
          <GrantCard key={index} {...card} />
        ))}
      </div>
    </section>
  )
}