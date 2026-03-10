"use client";
import Link from "next/link";
import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";

const navItems = [
  { label: "TRANG CHỦ", href: "/" },
  {
    label: "PLAYSTATION 5",
    href: "/products?category=ps5",
    children: [
      { label: "Đĩa game PS5", href: "/products?category=ps5" },
      { label: "Máy PS5", href: "/products?category=ps5&sub=console" },
      { label: "Tay cầm DualSense", href: "/products?category=ps5&sub=controller" },
      { label: "Phụ kiện PS5", href: "/products?category=ps5&sub=accessory" },
    ],
  },
  {
    label: "NINTENDO SWITCH",
    href: "/products?category=switch",
    children: [
      { label: "Băng game Switch", href: "/products?category=switch" },
      { label: "Máy Nintendo Switch 2", href: "/products?category=switch&sub=console" },
      { label: "Phụ kiện Switch", href: "/products?category=switch&sub=accessory" },
    ],
  },
  {
    label: "TRADING CARD GAME",
    href: "/products?category=pokemon-tcg",
    children: [
      { label: "Pokemon TCG", href: "/products?category=pokemon-tcg" },
      { label: "One Piece TCG", href: "/products?category=one-piece-tcg" },
    ],
  },
  { label: "TIN TỨC", href: "/news" },
  { label: "HỖ TRỢ", href: "/support" },
  { label: "GIỚI THIỆU", href: "/about" },
  { label: "LIÊN HỆ", href: "/contact" },
  { label: "TRACKING ORDER", href: "/tracking" },
];

export default function NavMenu() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function onEnter(label: string) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenMenu(label);
  }

  function onLeave() {
    timeoutRef.current = setTimeout(() => setOpenMenu(null), 150);
  }

  return (
    <nav className="hidden border-b border-gray-200 bg-white shadow-sm lg:block">
      <div className="mx-auto flex max-w-screen-xl items-center justify-center gap-0.5 px-4">
        {navItems.map((item) => (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => item.children && onEnter(item.label)}
            onMouseLeave={onLeave}
          >
            <Link
              href={item.href}
              className="flex items-center gap-0.5 px-3 py-3 text-[13px] font-medium text-gray-700 hover:text-[var(--brand-red)] transition-colors"
            >
              {item.label}
              {item.children && <ChevronDown size={12} />}
            </Link>

            {/* Dropdown */}
            {item.children && openMenu === item.label && (
              <div
                className="absolute left-0 top-full z-50 min-w-[200px] rounded-b-lg border border-gray-100 bg-white py-1 shadow-xl"
                onMouseEnter={() => onEnter(item.label)}
                onMouseLeave={onLeave}
              >
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--brand-red)] transition-colors"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
