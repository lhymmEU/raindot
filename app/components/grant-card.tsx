import Image from "next/image"
import Link from "next/link"

export interface GrantCardProps {
  imageUrl?: string
  title?: string
  subtitle?: string
  buttonText?: string
  href?: string
}

export default function GrantCard({
  imageUrl = "/placeholder.svg?height=200&width=400",
  title = "DOTPLAY BOUNTY",
  subtitle = "Funding For Gaming Projects",
  buttonText = "VIEW",
  href = "#",
}: GrantCardProps) {
  return (
    <div className="max-w-sm border border-gray-200 bg-white shadow-sm">
      <div className="bg-black w-full h-48 relative">
        {imageUrl && <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />}
      </div>

      <div className="p-5">
        <h2 className="text-2xl font-bold tracking-wider uppercase mb-2">{title}</h2>
        <div className="w-full h-px bg-gray-300 mb-2"></div>
        <p className="text-gray-700 mb-4">{subtitle}</p>

        <Link href={href} className="block">
          <button className="w-full bg-black text-white py-3 font-bold tracking-wider uppercase">{buttonText}</button>
        </Link>
      </div>
    </div>
  )
}
