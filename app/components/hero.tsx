import Link from "next/link"

interface HeroProps {
  title: string;
  description: string;
  buttonOneText?: string;
  buttonTwoText?: string;
}

export default function Hero({ title, description, buttonOneText, buttonTwoText }: HeroProps) {
  return (
    <section className="py-16 text-center px-4 border-b">
      <h1 className="text-[80px] font-[700] tracking-tight mb-6">{title}</h1>
      <p className="text-[44px] font-[500] max-w-3xl mx-auto mb-10 uppercase tracking-wide leading-none">
        {description}
      </p>
      {/* If buttonOneText and buttonTwoText are provided, show the buttons */}
      {buttonOneText && buttonTwoText && <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button className="w-[346px] h-[77px] px-4 py-2 bg-black hover:bg-gray-800 text-[32px] text-white font-[500] uppercase tracking-wide cursor-pointer">
          {buttonOneText}
        </button>
        <button className="w-[346px] h-[77px] px-4 py-2 border border-black uppercase text-[32px] font-[500] tracking-wide cursor-pointer hover:bg-gray-300">
          {buttonTwoText}
        </button>
      </div>}
    </section>
  )
}
