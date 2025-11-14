import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TSF Communication Club",
  description: "Improve communication & placement success across Kerala engineering colleges",
  keywords: ["TSF", "Communication Club", "Engineering", "Kerala", "Placement", "Public Speaking"],
  authors: [{ name: "TSF Team" }],
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "TSF Communication Club",
    description: "Improve communication & placement success across Kerala engineering colleges",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TSF Communication Club",
    description: "Improve communication & placement success across Kerala engineering colleges",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
