"use client";

import { useRouter } from "next/navigation";

interface CardProps {
  title: string;
  descriptionTop: string;
  descriptionBottom: string;
  link: string;
}

export default function Card({
  title,
  descriptionTop,
  descriptionBottom,
  link,
}: CardProps) {
  const router = useRouter();
  return (
    <div onClick={() => router.push(link)} className="border border-black w-[420px] h-[420px] flex flex-col items-center justify-center aspect-square hover:bg-black hover:text-white transition-colors duration-300">
      <h2 className="text-[50px] font-[500] md:text-4xl font-bold mb-6">
        {title}
      </h2>
      <div className="flex flex-col items-center justify-center">
        <p className="text-center uppercase text-[30px] font-[500]">
          {descriptionTop}
        </p>
        <p className="text-center uppercase text-[30px] font-[500] -mt-4">
          {descriptionBottom}
        </p>
      </div>
    </div>
  );
}
