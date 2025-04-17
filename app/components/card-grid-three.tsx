import Card from "@/app/components/card";

export default function CardGrid() {
  const cards = [
    { title: "JAM", descriptionTop: "ONE LINER", descriptionBottom: "ONE LINER" },
    { title: "BUILD", descriptionTop: "ONE LINER", descriptionBottom: "ONE LINER" },
    { title: "EARN", descriptionTop: "ONE LINER", descriptionBottom: "ONE LINER" },
  ]

  return (
    <section className="mx-auto px-4 py-[50px] px-[68px]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[28px] mx-auto">
        {cards.map((card, index) => (
          <Card key={index} title={card.title} descriptionTop={card.descriptionTop} descriptionBottom={card.descriptionBottom} />
        ))}
      </div>
    </section>
  )
}