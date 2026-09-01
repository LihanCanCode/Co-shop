import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import CartHydrator from "@/components/CartHydrator";
import WebMCPTools from "@/components/WebMCPTools";
import ToolActivityToast from "@/components/ToolActivityToast";
import CheckoutConfirmBar from "@/components/CheckoutConfirmBar";
import AnimatedBackground from "@/components/AnimatedBackground";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
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
      className={`${outfit.variable} ${inter.variable} h-full antialiased font-sans`}
    >
      <body className="flex min-h-full flex-col bg-cs-bg text-cs-text-primary relative">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-cs-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <AnimatedBackground />
        <CartHydrator />
        <WebMCPTools />
        <Header />
        <main id="main-content" className="flex-1 relative z-10">
          {children}
        </main>
        <CheckoutConfirmBar />
        <ToolActivityToast />
      </body>
    </html>
  );
}
