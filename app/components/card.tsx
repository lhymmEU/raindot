"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

interface CardProps {
  title: string;
  imageUrl: string;
  description: string;
  buttonLink: string;
}

export default function Card({
  title,
  imageUrl,
  description,
  buttonLink,
}: CardProps) {
  const router = useRouter();
  
  const handleButtonClick = () => {
    router.push(buttonLink);
  };
  
  return (
    <div className="relative w-[350px] border border-black rounded-[30px] overflow-hidden flex flex-col">
      {/* Image section */}
      <div className="h-[180px] w-full bg-black relative">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        )}
      </div>
      
      {/* Content section */}
      <div className="p-8 flex flex-col">
        <h2 className="text-[32px] font-bold mb-4">
          {title}
        </h2>
        
        <p className="text-[16px] leading-tight mb-8 text-black/80">
          {description}
        </p>
        
        <button 
          onClick={handleButtonClick}
          className="bg-black text-white px-8 py-1 rounded-full w-fit text-[20px] font-[400] hover:opacity-90"
        >
          Open
        </button>
      </div>
    </div>
  );
}
