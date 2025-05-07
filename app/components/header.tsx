"use client";

import Image from "next/image";
import HeaderButton from "./header-button";

export default function Header() {
  const jamItems = [
    { text: "Item 1", href: "#" },
    { text: "Item 2", href: "#" },
    { text: "Item 3", href: "#" },
  ];

  const buildItems = [
    { text: "Item 1", href: "#" },
    { text: "Item 2", href: "#" },
    { text: "Item 3", href: "#" },
  ];

  const learnItems = [
    { text: "Item 1", href: "#" },
    { text: "Item 2", href: "#" },
    { text: "Item 3", href: "#" },
  ];

  const earnItems = [
    { text: "Item 1", href: "#" },
    { text: "Item 2", href: "#" },
    { text: "Item 3", href: "#" },
  ];

  return (
    <header className="p-6 flex justify-between items-center border-b border-black">
      <Image
        src="/polkadot-logo.svg"
        alt="Raindot Logo"
        width={32}
        height={32}
      />

      <div className="flex gap-[40px] text-[24px] font-[300]">
        <HeaderButton text="JAM" dropdownItems={jamItems} />
        <HeaderButton text="Build" dropdownItems={buildItems} />
        <HeaderButton text="Learn" dropdownItems={learnItems} />
        <HeaderButton text="Earn" dropdownItems={earnItems} />
      </div>

      {/* This is used to make the header buttons center aligned */}
      <div className="invisible">
        <Image
          src="/polkadot-logo.svg"
          alt="Placeholder"
          width={32}
          height={32}
        />
      </div>
    </header>
  );
}
