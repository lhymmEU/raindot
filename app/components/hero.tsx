interface HeroProps {
  title: string;
  description?: string;
  buttonText?: string;
}

export default function Hero({ title, description, buttonText }: HeroProps) {
  return (
    <section className="py-[64px] px-[82px] border-b border-black">
      <div className="flex flex-col">
        <h1 className="text-[80px] font-[700] tracking-tight">{title}</h1>
        {description && (
          <p className="text-[24px] font-[400] tracking-tight leading-none">
            {description}
          </p>
        )}
      </div>

      {buttonText && (
        <button className="bg-black text-white text-[32px] font-[500] px-[40px] py-2 uppercase mt-6 rounded-full">
          {buttonText}
        </button>
      )}
    </section>
  );
}