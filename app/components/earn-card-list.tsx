import { EarnCard, type EarnCardProps } from "@/app/components/earn-card";

interface EarnCardListProps {
  opportunities: EarnCardProps[]
}

export function EarnCardList({ opportunities }: EarnCardListProps) {
  return (
    <div className="rounded-3xl border border-gray-200 overflow-hidden mx-[82px] my-[32px]">
      {opportunities.map((opportunity, index) => (
        <EarnCard
          key={index}
          title={opportunity.title}
          tags={opportunity.tags}
          description={opportunity.description}
        />
      ))}
    </div>
  )
}
