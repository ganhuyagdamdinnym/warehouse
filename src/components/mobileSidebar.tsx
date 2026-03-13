import React, { useState, type Dispatch, type SetStateAction } from "react";
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
  AiOutlineLink,
} from "react-icons/ai";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

interface SubMenuItem {
  name: string;
  href: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  children?: SubMenuItem[];
}

const navigation: NavItem[] = [
  {
    name: "Орлого",
    href: "/checkins",
    icon: AiOutlineArrowLeft,
    children: [
      { name: "Бүх орлогын жагсаалт", href: "/checkin" },
      { name: "Шинэ орлого бүртгэх", href: "/checkin/create" },
    ],
  },
  {
    name: "Зарлага",
    href: "/checkouts",
    icon: AiOutlineArrowRight,
    children: [
      { name: "Бүх зарлагын жагсаалт", href: "/checkout" },
      { name: "Шинэ зарлага бүртгэх", href: "/checkout/create" },
    ],
  },
  {
    name: "Өөрчлөлт",
    href: "/adjustments",
    icon: AiOutlineControl,
    children: [
      { name: "Өөрчлөлтийн жагсаалт", href: "/adjustment" },
      { name: "Шинэ өөрчлөлт хийх", href: "/adjustment/create" },
    ],
  },
  {
    name: "Шилжүүлэг",
    href: "/transfers",
    icon: AiOutlineTruck,
    children: [
      { name: "Шилжүүлгийн жагсаалт", href: "/transfer" },
      { name: "Шинэ шилжүүлэг хийх", href: "/transfer/create" },
    ],
  },
  {
    name: "Бараа",
    href: "/items",
    icon: AiOutlineHeart,
    children: [
      { name: "Бүх барааны жагсаалт", href: "/items" },
      { name: "Шинэ бараа нэмэх", href: "/items/create" },
    ],
  },
  {
    name: "Харилцагч",
    href: "/contacts",
    icon: AiOutlineTeam,
    children: [
      { name: "Бүх харилцагч", href: "/contacts" },
      { name: "Шинэ харилцагч нэмэх", href: "/contacts/create" },
    ],
  },
  {
    name: "Ангилал",
    href: "/categories",
    icon: AiOutlineDatabase,
    children: [
      { name: "Бүх ангилал", href: "/categories" },
      { name: "Шинэ ангилал үүсгэх", href: "/categories/create" },
    ],
  },
  {
    name: "Нэгж",
    href: "/units",
    icon: AiOutlineCi,
    children: [
      { name: "Бүх нэгж", href: "/units" },
      { name: "Шинэ нэгж үүсгэх", href: "/units/create" },
    ],
  },
  {
    name: "Агуулах",
    href: "/warehouses",
    icon: AiOutlineBank,
    children: [
      { name: "Бүх агуулах", href: "/warehouses" },
      { name: "Шинэ агуулах нэмэх", href: "/warehouses/create" },
    ],
  },
  {
    name: "Хэрэглэгч",
    href: "/users",
    icon: AiOutlineUsergroupAdd,
    children: [
      { name: "Бүх хэрэглэгч", href: "/users" },
      { name: "Хэрэглэгчийн эрхүүд", href: "/roles" },
      { name: "Шинэ хэрэглэгч нэмэх", href: "/users/create" },
      { name: "Шинэ хэрэглэгчийн эрх үүсгэх", href: "/roles/create" },
    ],
  },
  {
    name: "Тайлан",
    href: "/reports",
    icon: AiOutlineLineChart,
    children: [
      { name: "Нийт бүртгэл", href: "/reports" },
      { name: "Орлогын тайлан", href: "/reports/checkin" },
      { name: "Зарлагын тайлан", href: "/reports/checkout" },
      { name: "Шилжүүлгийн тайлан", href: "/reports/transfer" },
      { name: "Өөрчлөлтийн тайлан", href: "/reports/adjustment" },
    ],
  },
];

type Props = {
  setIsOpenSidebar: Dispatch<SetStateAction<boolean>>;
  isOpenSidebar: boolean;
};

export const MobileSidebar = (props: Props) => {
  const { setIsOpenSidebar } = props;
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const location = useLocation();

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <div
      className="bg-gray-800 text-gray-300 w-full grid-cols-1 place-content-between overflow-x-hidden overflow-y-auto ondark"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>{`div.ondark::-webkit-scrollbar { display: none; }`}</style>
      <div className="py-2">
        <div className="mt-1 font-bold text-xs text-gray-600 px-4 py-2 uppercase tracking-wider">
          Үндсэн
        </div>

        <Link
          onClick={() => setIsOpenSidebar(false)}
          to="/"
          className={`md:py-3 flex items-center border-b border-[#0000004d] px-4 md:px-2 py-4 lg:px-4 transition-all duration-200 ${
            location.pathname === "/"
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-700 hover:text-white"
          }`}
        >
          <AiFillHome className="w-4 h-4 mr-3" />
          <span className="grow font-medium">Хянах самбар</span>
        </Link>

        {navigation.map((item) => {
          const isMenuOpen = !!openMenus[item.name];
          const isActive = location.pathname.startsWith(item.href);

          return (
            <div key={item.name} className="flex flex-col">
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
                    <IoIosArrowUp className="w-3 h-3" />
                  ) : (
                    <IoIosArrowDown className="w-3 h-3" />
                  )
                ) : (
                  <IoIosArrowDown className="w-3 h-3 text-gray-500/50" />
                )}
              </div>

              {item.children && isMenuOpen && (
                <div className="bg-gray-900/50 overflow-hidden transition-all">
                  {item.children.map((child) => (
                    <Link
                      onClick={() => setIsOpenSidebar(false)}
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
