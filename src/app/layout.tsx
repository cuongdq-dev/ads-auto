import { AuthProvider, I18nProvider } from "@/components/provider";
// import { Toasts } from "@/components/ui";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type React from "react";
import { Suspense } from "react";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TVHS - Auto Ads",
  generator: "v0.app",
};

type LayoutProps = { children: React.ReactNode };
export default function RootLayout({ children }: Readonly<LayoutProps>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <Suspense fallback={<div></div>}>
          <AuthProvider>
            <I18nProvider>
              <ToastProvider>{children}</ToastProvider>
            </I18nProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
