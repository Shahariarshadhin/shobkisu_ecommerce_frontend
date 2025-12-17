"use client";

import { usePathname } from "next/navigation";
import Navbar from "../Layout/Navbar";
import Footer from "../Layout/Footer";
import { ReduxProvider } from "../../app/providers";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // Pages or prefixes where navbar & footer should be hidden
  const hideLayoutPrefixes = ["/advertise", "/dashboard"];
  const shouldHide = hideLayoutPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  return (
    <>
      <ReduxProvider>
        {!shouldHide && <Navbar />}
        {children}
        {!shouldHide && <Footer />}
      </ReduxProvider>

    </>
  );
}
