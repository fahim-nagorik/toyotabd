import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Toyota Type (client-provided webfont kit). Semibold covers the 500–600
// range so Tailwind's font-medium resolves to it rather than Regular.
const toyotaType = localFont({
  src: [
    { path: "./fonts/ToyotaType-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/ToyotaType-Book.woff2", weight: "350", style: "normal" },
    { path: "./fonts/ToyotaType-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ToyotaType-Semibold.woff2", weight: "500 600", style: "normal" },
    { path: "./fonts/ToyotaType-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/ToyotaType-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-toyota-type",
  display: "swap",
});
import LenisProvider from "@/components/LenisProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Toyota Bangladesh",
  description:
    "Toyota Bangladesh — vehicles, service and genuine parts. Demo site.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${toyotaType.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <LenisProvider />
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
