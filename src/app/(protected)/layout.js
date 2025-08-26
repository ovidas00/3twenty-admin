"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  User,
  Home,
  BarChart3,
  Users,
  Settings,
  FileText,
  Calendar,
  X,
  LogOut,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Image from "next/image";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Keep track of open submenus
  const [openSubmenus, setOpenSubmenus] = useState({});

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Users", href: "/users", icon: Users },
    { name: "Documents", href: "/documents", icon: FileText },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    {
      name: "Settings",
      icon: Settings,
      children: [
        { name: "Account Config", href: "/settings/account" },
        { name: "Limits Config", href: "/settings/limits" },
        { name: "Staking Config", href: "/settings/staking" },
        { name: "Referral Config", href: "/settings/referral" },
        { name: "Ranking Config", href: "/settings/ranking" },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    router.replace("/auth/login");
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      router.replace("/auth/login");
    } else {
      setIsVerified(true);
    }
  }, [router]);

  const toggleSubmenu = (name) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // ✅ Keep submenu open when pathname matches a child
  useEffect(() => {
    navigation.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          (child) => child.href === pathname
        );
        if (hasActiveChild) {
          setOpenSubmenus((prev) => ({ ...prev, [item.name]: true }));
        }
      }
    });
  }, [pathname]);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await api.get("/auth/me");
      return response.data.payload.user;
    },
    enabled: isVerified,
  });

  if (!isVerified) return null;

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-gray-200 border-r border-gray-800 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center">
            <Image src="/icon-300x100.png" alt="Logo" width={170} height={85} />
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Nav */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (item.children) {
              const isOpen = openSubmenus[item.name];

              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    className="group flex items-center w-full px-3 py-2 text-md font-medium rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <Icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
                    {item.name}
                    <span className="ml-auto transition-transform duration-300 text-gray-600">
                      {isOpen ? <ChevronUp /> : <ChevronDown />}
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ml-8 space-y-1 ${
                      isOpen ? "max-h-screen" : "max-h-0"
                    }`}
                  >
                    {item.children.map((child) => (
                      <a
                        key={child.name}
                        href={child.href}
                        className={`block px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg text-sm ${
                          pathname === child.href
                            ? "bg-gray-800 text-blue-500"
                            : ""
                        }`}
                      >
                        {child.name}
                      </a>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <a
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-md font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-gray-800 text-blue-500"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 ${
                    isActive
                      ? "text-blue-500"
                      : "text-gray-400 group-hover:text-white"
                  }`}
                />
                {item.name}
              </a>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-800 p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-200" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-200">{user?.name}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-red-500 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-50 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-2">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
