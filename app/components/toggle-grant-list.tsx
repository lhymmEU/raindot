"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import CardGrid from "@/app/components/grant-card-grid";
import { GrantCardProps } from "@/app/components/grant-card";

interface ToggleGrantListProps {
  listName: string;
  cards: GrantCardProps[];
}

export default function ToggleGrantList({ listName, cards }: ToggleGrantListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full border-b border-black px-[68px] py-[40px]">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-[44px] h-[44px]" />
          ) : (
            <ChevronRight className="w-[44px] h-[44px]" />
          )}
          <h3 className="text-[30px] font-[400]">{listName}</h3>
        </div>
      </button>
      
      {isExpanded && <CardGrid cards={cards} />}
    </div>
  );
} 