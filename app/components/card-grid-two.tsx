import Card from "@/app/components/card";

export default function CardGrid() {
  const cards = [
    { title: "JAM", descriptionTop: "ONE LINER", descriptionBottom: "ONE LINER" },
    { title: "BUILD", descriptionTop: "ONE LINER", descriptionBottom: "ONE LINER" },
    { title: "EARN", descriptionTop: "ONE LINER", descriptionBottom: "ONE LINER" },
    { title: "LEARN", descriptionTop: "ONE LINER", descriptionBottom: "ONE LINER" },
  ]

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
