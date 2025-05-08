"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Search() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [fundingType, setFundingType] = useState("Funding type")

  return (
    <div className="flex flex-wrap gap-3 items-center px-[82px] py-[32px]">
      <div className="relative">
        <Input type="text" placeholder="Search" className="w-[320px] rounded-full border-gray-300 pl-4" />
      </div>

      <Button
        variant={activeFilter === "All" ? "default" : "outline"}
        className={`rounded-full px-6 ${
          activeFilter === "All"
            ? "bg-black text-white hover:bg-black/90"
            : "border-gray-300 hover:bg-gray-100 hover:text-gray-900"
        }`}
        onClick={() => setActiveFilter("All")}
      >
        All
      </Button>

      <Button
        variant={activeFilter === "Technical" ? "default" : "outline"}
        className={`rounded-full px-6 ${
          activeFilter === "Technical"
            ? "bg-black text-white hover:bg-black/90"
            : "border-gray-300 hover:bg-gray-100 hover:text-gray-900"
        }`}
        onClick={() => setActiveFilter("Technical")}
      >
        Technical
      </Button>

      <Button
        variant={activeFilter === "Non-Technical" ? "default" : "outline"}
        className={`rounded-full px-6 ${
          activeFilter === "Non-Technical"
            ? "bg-black text-white hover:bg-black/90"
            : "border-gray-300 hover:bg-gray-100 hover:text-gray-900"
        }`}
        onClick={() => setActiveFilter("Non-Technical")}
      >
        Non-Technical
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto rounded-[10px] border-gray-300 px-6 flex items-center gap-2">
            {fundingType}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setFundingType("Type A")}>Grants</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFundingType("Type B")}>Bug bounty programs</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFundingType("Type C")}>On chain treasury</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
