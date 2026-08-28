import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import CartHydrator from "@/components/CartHydrator";
import WebMCPTools from "@/components/WebMCPTools";
import ToolActivityToast from "@/components/ToolActivityToast";
import CheckoutConfirmBar from "@/components/CheckoutConfirmBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoShop — an agent-native storefront",
  description:
    "CoShop is a WebMCP-powered storefront where a person and their AI agent can browse, compare, and check out together.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-neutral-950 text-neutral-100">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-emerald-500 focus:px-4 focus:py-2 focus:font-semibold focus:text-neutral-950"
        >
          Skip to content
        </a>
        <CartHydrator />
        <WebMCPTools />
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <CheckoutConfirmBar />
        <ToolActivityToast />
      </body>
    </html>
  );
}
