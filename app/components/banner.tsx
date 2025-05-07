interface BannerProps {
    title: string;
    description: string;
  }
  
  export default function Banner({ title, description }: BannerProps) {
    return (
      <section className="py-[64px] px-[82px]">
        <div className="flex flex-col">
          <h1 className="text-[80px] font-[700] tracking-tight">{title}</h1>
          <p className="text-[24px] font-[400] tracking-tight leading-none">
            {description}
          </p>
        </div>
      </section>
    );
  }