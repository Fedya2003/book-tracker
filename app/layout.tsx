import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { ThemeProvider } from "./components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kitob Tracker",
  description: "Kitoblaringizni kuzatib boring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="uz" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />

            {/* Agar foydalanuvchi tizimga kirgan bo‘lsa */}
            <SignedIn>
              <main className="container mx-auto p-4">
                {children}
              </main>
            </SignedIn>

            {/* Agar tizimga kirmagan bo‘lsa */}
            <SignedOut>
              <main className="container mx-auto p-4 text-center">
                <h1 className="text-2xl font-semibold mb-4">Iltimos, tizimga kiring yoki ro‘yxatdan o‘ting.</h1>
                <p className="text-gray-500">Statistikalarni ko‘rish uchun hisobingizga kiring.</p>
              </main>
            </SignedOut>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
