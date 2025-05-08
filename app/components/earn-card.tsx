import { Button } from "@/components/ui/button"

export interface EarnCardProps {
  title: string
  tags: string[]
  description: string
}

export function EarnCard({
  title,
  tags,
  description,
}: EarnCardProps) {
  return (
    <div className="py-12 px-8 border-b border-gray-200 last:border-b-0">
      <h2 className="text-[32px] font-[500] mb-6">{title}</h2>

      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag, index) => (
          <span key={index} className="px-4 py-2 rounded-full border border-gray-300 text-[20px] font-[400]">
            {tag}
          </span>
        ))}
      </div>

      <p className="text-[20px] font-[500] mb-6">{description}</p>

      <Button
        variant="default"
        className="bg-black text-white text-[20px] font-[400] hover:bg-gray-800 rounded-full px-8"
      >
        Open
      </Button>
    </div>
  )
}
