"use client";
import {
  Home,
  BarChart3,
  Users,
  Settings,
  FileText,
  Bell,
  Search,
  Menu,
  ChevronDown,
  LogOut,
  User,
  Layers,
  Megaphone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { logout } from "../../redux/authSlice";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [orderMenuOpen, setOrderMenuOpen] = useState(false);
  const [advertiseMenuOpen, setAdvertiseMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const navItems = [
    { icon: Home, label: "Dashboard", active: true, link: "/dashboard" },
    {
      icon: BarChart3,
      label: "Order",
      hasSubmenu: true,
      submenu: [
        { label: "Create Order", link: "/dashboard/order/create" },
        { label: "Orders", link: "/dashboard/order" },
      ],
    },
    {
      icon: Megaphone,
      label: "Advertisement",
      hasSubmenu: true,
      submenu: [
        {
          label: "Create Advertisement",
          link: "/dashboard/advertise/create-advertisement-content",
        },
        {
          label: "Advertisement List",
          link: "/dashboard/advertise/advertise-list",
        },
      ],
    },
    {
      icon: Users,
      label: "Users",
      link: "/dashboard/users",
      roles: ["admin", "super_admin"],
    },
    { icon: Layers, label: "Brand Management", link: "/dashboard/brands" },
    { icon: FileText, label: "Projects", link: "/dashboard/projects" },
    { icon: Settings, label: "Settings", link: "/dashboard/settings" },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  return (
    <ProtectedRoute>
      <html lang="en">
        <body>
          <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
              className={`${
                sidebarOpen ? "w-64" : "w-20"
              } bg-slate-900 text-white transition-all duration-300 flex flex-col`}
            >
              {/* Logo */}
              <Link href="/" className="p-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16">
                    <Image
                      className="w-full h-full rounded-lg"
                      src="/assets/Logo/shobkisulogo.png"
                      alt="logo"
                      width={100}
                      height={100}
                    />
                  </div>
                  {sidebarOpen && (
                    <span className="font-semibold text-lg">সব কিছু</span>
                  )}
                </div>
              </Link>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {filteredNavItems.map((item) => (
                  <div key={item.label}>
                    {item.hasSubmenu ? (
                      <>
                        <button
                          onClick={() => {
                            if (item.label === "Order") {
                              setOrderMenuOpen(!orderMenuOpen);
                            } else if (item.label === "Advertisement") {
                              setAdvertiseMenuOpen(!advertiseMenuOpen);
                            }
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            item.active
                              ? "bg-[#C8AF9C] text-white"
                              : "text-gray-300 hover:bg-slate-800"
                          }`}
                        >
                          <item.icon size={20} />
                          {sidebarOpen && (
                            <>
                              <span className="flex-1 text-left">
                                {item.label}
                              </span>
                              <ChevronDown
                                size={16}
                                className={`transition-transform ${
                                  (item.label === "Order" && orderMenuOpen) ||
                                  (item.label === "Advertisement" &&
                                    advertiseMenuOpen)
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </>
                          )}
                        </button>

                        {/* Submenu */}
                        {item.hasSubmenu &&
                          ((item.label === "Order" && orderMenuOpen) ||
                            (item.label === "Advertisement" &&
                              advertiseMenuOpen)) &&
                          sidebarOpen && (
                            <div className="mt-2 ml-4 space-y-1">
                              {item.submenu.map((subItem) => (
                                <Link
                                  key={subItem.label}
                                  href={subItem.link}
                                  className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-slate-800 transition-colors"
                                >
                                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                                  <span>{subItem.label}</span>
                                </Link>
                              ))}
                            </div>
                          )}
                      </>
                    ) : (
                      <Link
                        href={item.link}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          item.active
                            ? "bg-[#C8AF9C] text-white"
                            : "text-gray-300 hover:bg-slate-800"
                        }`}
                      >
                        <item.icon size={20} />
                        {sidebarOpen && <span>{item.label}</span>}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* User Profile */}
              <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  {sidebarOpen && (
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">
                        {user?.role || "user"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              {/* Top Navbar */}
              <header className="bg-white border-b border-gray-200 h-24 flex items-center justify-between px-6">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Menu size={20} className="text-gray-600" />
                  </button>

                  {/* Search */}
                  <div className="relative">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2 w-80 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                  {/* Notifications */}
                  <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell size={20} className="text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {user?.name || "User"}
                      </span>
                      <ChevronDown size={16} className="text-gray-400" />
                    </button>

                    {/* Dropdown Menu */}
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                        <Link
                          href="/dashboard/profile"
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <User size={16} />
                          Profile
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Settings size={16} />
                          Settings
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </header>

              {/* Page Content */}
              <main className="flex-1 p-6 bg-gray-100 overflow-auto">
                {children}
              </main>
            </div>
          </div>
        </body>
      </html>
    </ProtectedRoute>
  );
}
