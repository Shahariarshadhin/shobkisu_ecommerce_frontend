
"use client";
import {
  BarChart3,
  Bell,
  ChevronDown,
  Database,
  FileText,
  Grid3x3,
  Home,
  List,
  LogOut,
  Megaphone,
  Menu,
  Package,
  Palette,
  PlusCircle,
  Search,
  Settings,
  Shield,
  Smartphone,
  Tag,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import ProtectedRoute from "../../components/ProtectedRoute";
import { logout } from "../../redux/authSlice";

// Navigation configuration
const NAV_CONFIG = [
  { icon: Home, label: "Dashboard", link: "/dashboard" },
  {
    icon: BarChart3,
    label: "Advertisement Order",
    submenu: [
      { label: "Create Order", link: "/dashboard/order/create", icon: PlusCircle },
      { label: "Orders", link: "/dashboard/order", icon: List },
    ],
  },
  {
    icon: Megaphone,
    label: "Advertisement",
    submenu: [
      { label: "Create Advertisement", link: "/dashboard/advertise/create-advertisement-content", icon: PlusCircle },
      { label: "Advertisement List", link: "/dashboard/advertise/advertise-list", icon: List },
    ],
  },
  {
    icon: Users,
    label: "Users",
    link: "/dashboard/users",
    roles: ["admin", "super_admin"],
  },
  {
    icon: Package,
    label: "Product Management",
    submenu: [
      { label: "Create Product", link: "/dashboard/products/create-product", icon: Tag },
      { label: "Product List", link: "/dashboard/products", icon: Grid3x3 },
    ],
  },
  {
    icon: Package,
    label: "Product Config",
    submenu: [
      { label: "Brand Management", link: "/dashboard/brands", icon: Tag },
      { label: "Model Management", link: "/dashboard/models", icon: Grid3x3 },
      { label: "Color Management", link: "/dashboard/colors", icon: Palette },
      { label: "Storage Management", link: "/dashboard/storages", icon: Database },
      { label: "SIM Management", link: "/dashboard/sim-network", icon: Smartphone },
      { label: "Device Condition Management", link: "/dashboard/device-conditions", icon: Smartphone },
      { label: "Warranty Management", link: "/dashboard/warranties", icon: Shield },
    ],
  },
  { icon: FileText, label: "Projects", link: "/dashboard/projects" },
  { icon: Settings, label: "Settings", link: "/dashboard/settings" },
];

// Submenu Component
const NavSubmenu = ({ items, isOpen }) => {
  if (!isOpen) return null;
  
  return (
    <div className="mt-2 ml-4 space-y-1">
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.link}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-slate-800 transition-colors"
        >
          {item.icon && <item.icon size={16} className="text-gray-400" />}
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

// Nav Item Component
const NavItem = ({ item, isOpen, sidebarOpen, onToggle }) => {
  const hasSubmenu = Boolean(item.submenu);
  const Icon = item.icon;

  if (hasSubmenu) {
    return (
      <div>
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-3 px-2 py-3 rounded-lg text-gray-300 hover:bg-slate-800 transition-colors"
        >
          <Icon size={20} />
          {sidebarOpen && (
            <>
              <span className="flex-1 text-left text-md">{item.label}</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </>
          )}
        </button>
        {sidebarOpen && <NavSubmenu items={item.submenu} isOpen={isOpen} />}
      </div>
    );
  }

  return (
    <Link
      href={item.link}
      className="flex items-center gap-3 px-2 py-3 rounded-lg text-gray-300 hover:bg-slate-800 transition-colors"
    >
      <Icon size={20} />
      {sidebarOpen && <span className="text-md">{item.label}</span>}
    </Link>
  );
};

// User Avatar Component
const UserAvatar = ({ name, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-lg",
  };

  return (
    <div className={`${sizeClasses[size]} bg-linear-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center`}>
      <span className="text-white font-semibold">
        {name?.charAt(0).toUpperCase() || "U"}
      </span>
    </div>
  );
};

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});

  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    router.push("/login");
  }, [dispatch, router]);

  const toggleMenu = useCallback((label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  }, []);

  // Filter navigation items based on user role
  const filteredNavItems = useMemo(() => {
    return NAV_CONFIG.filter((item) => {
      if (!item.roles) return true;
      return user && item.roles.includes(user.role);
    });
  }, [user]);

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
              <div className="w-16 h-16 relative">
                <Image
                  className="rounded-lg object-cover"
                  src="/assets/Logo/shobkisulogo.png"
                  alt="সব কিছু লোগো"
                  fill
                  sizes="64px"
                />
              </div>
              {sidebarOpen && (
                <span className="font-semibold text-lg">সব কিছু</span>
              )}
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-2 overflow-y-auto scrollbar-hide">
            {filteredNavItems.map((item) => (
              <NavItem
                key={item.label}
                item={item}
                isOpen={openMenus[item.label]}
                sidebarOpen={sidebarOpen}
                onToggle={() => toggleMenu(item.label)}
              />
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <UserAvatar name={user?.name} />
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
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
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navbar */}
          <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 flex-shrink-0">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle sidebar"
              >
                <Menu size={20} className="text-gray-600" />
              </button>

              {/* Search */}
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-80 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Search"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" aria-hidden="true"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <UserAvatar name={user?.name} size="sm" />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name || "User"}
                  </span>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      href="/dashboard/profile"
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => setUserMenuOpen(false)}
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
          <main className="flex-1 p-6 overflow-auto scrollbar-hide">
            {children}
          </main>
        </div>
      </div>
      </body>
      </html>
    </ProtectedRoute>
  );
}