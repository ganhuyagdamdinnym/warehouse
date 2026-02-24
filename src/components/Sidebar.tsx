import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AiFillHome,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineControl,
  AiOutlineTruck,
  AiOutlineHeart,
  AiOutlineTeam,
  AiOutlineDatabase,
  AiOutlineCi,
  AiOutlineBank,
  AiOutlineUsergroupAdd,
  AiOutlineLineChart,
  AiOutlineDown,
  AiOutlineUp,
  AiOutlineLink,
} from "react-icons/ai";

// 1. Дата бүтцийг тодорхойлох Interface
interface SubMenuItem {
  name: string;
  href: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  children?: SubMenuItem[]; // Нэмэлт (optional) дэд цэс
}

const navigation: NavItem[] = [
  {
    name: "Checkins",
    href: "/checkins",
    icon: AiOutlineArrowLeft,
    children: [
      { name: "List All Checkins", href: "/checkin" },
      { name: "Create New Checkin", href: "/checkin/create" },
    ],
  },
  {
    name: "Checkouts",
    href: "/checkouts",
    icon: AiOutlineArrowRight,
    children: [
      { name: "List All Checkouts", href: "/checkout" },
      { name: "Create New Checkout", href: "/checkout/create" },
    ],
  },
  {
    name: "Adjustments",
    href: "/adjustments",
    icon: AiOutlineControl,
    children: [
      { name: "Adjustments", href: "/adjustment" },
      { name: "Create New Adjustment", href: "/adjustment/create" },
    ],
  },
  {
    name: "Transfers",
    href: "/transfers",
    icon: AiOutlineTruck,
    children: [
      { name: "Transfers", href: "/transfer" },
      { name: "Create New Transfer", href: "/transfer/create" },
    ],
  },
  {
    name: "Items",
    href: "/items",
    icon: AiOutlineHeart,
    children: [
      { name: "List All Items", href: "/items" },
      { name: "Create New Item", href: "/items/create" },
      { name: "Import Items", href: "/items/import" },
    ],
  },
  {
    name: "Contacts",
    href: "/contacts",
    icon: AiOutlineTeam,
    children: [
      { name: "List All Contacts", href: "/contacts" },
      { name: "Create New Contact", href: "/contacts/create" },
      { name: "Import Contacts", href: "/contacts/import" },
    ],
  },
  { name: "Categories", href: "/categories", icon: AiOutlineDatabase },
  { name: "Units", href: "/units", icon: AiOutlineCi },
  { name: "Warehouses", href: "/warehouses", icon: AiOutlineBank },
  { name: "Users", href: "/users", icon: AiOutlineUsergroupAdd },
  { name: "Reports", href: "/reports", icon: AiOutlineLineChart },
];

export const Sidebar: React.FC = () => {
  // 2. Аль цэс нээлттэй байгааг хянах State
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const location = useLocation();

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <div className="bg-gray-800 text-gray-300 w-full md:w-64 flex flex-col h-screen overflow-y-auto hidden md:flex print:hidden">
      <div className="py-2">
        <div className="mt-1 font-bold text-xs text-gray-600 px-4 py-2 uppercase tracking-wider">
          Main
        </div>

        {/* Dashboard Item */}
        <Link
          to="/"
          className={`md:py-3 flex items-center border-b border-[#0000004d] px-4 md:px-2 py-4 lg:px-4 transition-all duration-200 ${
            location.pathname === "/"
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-700 hover:text-white"
          }`}
        >
          <AiFillHome className="w-4 h-4 mr-3" />
          <span className="grow font-medium">Dashboard</span>
        </Link>

        {/* Navigation Mapping */}
        {navigation.map((item) => {
          const isMenuOpen = !!openMenus[item.name];
          // Одоогийн URL энэ цэсний href-ээр эхэлж байгаа эсэхийг шалгах
          const isActive = location.pathname.startsWith(item.href);

          return (
            <div key={item.name} className="flex flex-col">
              {/* Parent Menu Item */}
              <div
                onClick={() => toggleMenu(item.name)}
                className={`cursor-pointer border-b border-[#0000004d] flex items-center px-4 py-4 md:py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-700 hover:text-white"
                }`}
              >
                <span className="flex items-center grow">
                  <item.icon className="w-4 h-4 mr-3 shrink-0" />
                  <span className="font-medium">{item.name}</span>
                </span>

                {item.children ? (
                  isMenuOpen ? (
                    <AiOutlineUp className="w-3 h-3" />
                  ) : (
                    <AiOutlineDown className="w-3 h-3" />
                  )
                ) : (
                  <AiOutlineDown className="w-3 h-3 text-gray-500/50" />
                )}
              </div>

              {/* Submenu (Collapsible) */}
              {item.children && isMenuOpen && (
                <div className="bg-gray-900/50 overflow-hidden transition-all">
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      to={child.href}
                      className={`flex items-center py-3 pl-11 pr-4 text-sm border-b border-[#0000002d] transition-colors ${
                        location.pathname === child.href
                          ? "text-blue-400"
                          : "text-gray-400 hover:text-white hover:bg-gray-700"
                      }`}
                    >
                      <AiOutlineLink className="w-3 h-3 mr-2 opacity-50" />
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
