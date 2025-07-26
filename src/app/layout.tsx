import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SalesforceLearnHub - AI-Powered Salesforce Learning Platform",
  description: "Master Salesforce with AI-powered learning paths, smart content summaries, and certification guidance. Personalized learning for administrators, developers, and consultants.",
  keywords: "Salesforce, learning, certification, AI, training, administrator, developer, consultant, platform",
  authors: [{ name: "SalesforceLearnHub Team" }],
  openGraph: {
    title: "SalesforceLearnHub - AI-Powered Salesforce Learning",
    description: "Master Salesforce with AI-powered learning paths and smart content summaries",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SalesforceLearnHub - AI-Powered Salesforce Learning",
    description: "Master Salesforce with AI-powered learning paths and smart content summaries",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
