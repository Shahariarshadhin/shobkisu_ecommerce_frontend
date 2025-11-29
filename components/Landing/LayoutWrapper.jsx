"use client";

import { usePathname } from "next/navigation";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";


export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // Pages where navbar & footer should be hidden
  const hideLayout = ["/advertise/1"];
  const shouldHide = hideLayout.includes(pathname);

  return (
    <>
      {!shouldHide && <Navbar />}
      {children}
      {!shouldHide && <Footer />}
    </>
  );
}
