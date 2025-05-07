"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

type DropdownItem = {
  text: string;
  href: string;
};

type HeaderButtonProps = {
  text: string;
  dropdownItems?: DropdownItem[];
};

const HeaderButton = ({ text, dropdownItems }: HeaderButtonProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate position for dropdown
  useEffect(() => {
    if (showDropdown && buttonRef.current && dropdownRef.current) {
      // Get the button's positioning
      const buttonRect = buttonRef.current.getBoundingClientRect();
      // Set the dropdown's positioning
      dropdownRef.current.style.left = `${buttonRect.left}px`;
      dropdownRef.current.style.top = `${buttonRect.bottom + 8}px`;
    }
  }, [showDropdown]);

  return (
    <>
      <button
        ref={buttonRef}
        className="cursor-pointer text-[24px] font-[300] px-[20px] rounded-[30px] hover:bg-black hover:text-white"
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => {
          // Small delay to allow moving cursor to dropdown
          setTimeout(() => {
            if (dropdownRef.current && !dropdownRef.current.matches(":hover")) {
              setShowDropdown(false);
            }
          }, 100);
        }}
      >
        {text}
      </button>

      {showDropdown &&
        dropdownItems &&
        dropdownItems.length > 0 &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed w-[264px] bg-white border border-gray-200 rounded-md shadow-lg z-10"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <div className="flex flex-col gap-[10px] p-[20px]">
              {dropdownItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="block hover:bg-black hover:text-white"
                >
                  {item.text}
                </a>
              ))}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default HeaderButton;
