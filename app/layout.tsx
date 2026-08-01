import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Premium Sports Wear — Engineered for the Grid",
  description:
    "Motorcycle racing suits, kart racing gear, sportswear, and team uniforms — manufactured in Sialkot, Pakistan, shipped worldwide.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;700;800;900&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black text-cream font-body">
        <AuthProvider>
          <Nav />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
