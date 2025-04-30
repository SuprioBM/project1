// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import { CartProvider } from "../components/context/CartContext";
import { NavbarSettings } from "../components/components/NavbarSettings";
import Footer from "../components/components/Footer";
import { Toaster } from "sonner";
import "sonner/dist/styles.css";

export const metadata = {
  title: "Your Shop",
  description: "An amazing fashion store",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <CartProvider>
          <Toaster richColors position="top-right" />
          <NavbarSettings />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
