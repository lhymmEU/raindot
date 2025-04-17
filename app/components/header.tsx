"use client";

import { useState } from "react";
import { Link, Menu } from "lucide-react";
import Image from "next/image";
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="p-6 flex justify-between items-center border-b border-black">
      <Image
        src="/polkadot-logo.svg"
        alt="Raindot Logo"
        width={32}
        height={32}
      />

      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="focus:outline-none"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isMenuOpen && (
        <div className="absolute top-16 right-6 bg-white shadow-lg p-4 z-50">
          <ul className="space-y-2">
            <li>Menu Item 1</li>
            <li>Menu Item 2</li>
            <li>Menu Item 3</li>
          </ul>
        </div>
      )}
    </header>
  );
}
