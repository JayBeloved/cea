import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import "./globals.css";

export const revalidate = 60;

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  let logoUrl = "/favicon.ico"; // default
  try {
    const generalSnap = await getDoc(doc(db, "settings", "general"));
    if (generalSnap.exists() && generalSnap.data().logoUrl) {
      logoUrl = generalSnap.data().logoUrl;
    }
  } catch (error) {
    console.error("Error fetching logo for metadata:", error);
  }

  return {
    title: "CEA Professional Services",
    description: "Premium professional services firm.",
    icons: {
      icon: logoUrl,
    }
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-foreground bg-background">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
