import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { APP_NAME, APP_DESCRIPTION } from "@/constants";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/shared/Navbar";
import { auth } from "@/lib/auth";
import { Footer } from "@/components/shared/Footer";
import { CartDrawer } from "@/components/checkout/CartDrawer";
import "@uploadthing/react/styles.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: `${APP_NAME} — ${APP_DESCRIPTION}`,
  description: "Marketplace for construction materials and professional services.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" className="light">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${inter.variable} bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased`}
      >
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <Providers session={session}>
          <Navbar />
          <CartDrawer />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
