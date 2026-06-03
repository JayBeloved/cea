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
  let siteName = "CEA Professional Services";
  
  try {
    const generalSnap = await getDoc(doc(db, "settings", "general"));
    if (generalSnap.exists() && generalSnap.data().siteName) {
      siteName = generalSnap.data().siteName;
    }
  } catch (error) {
    console.error("Error fetching settings for metadata:", error);
  }

  const description = "Premium professional advisory and strategy consulting. We deliver end-to-end strategic solutions to solve complex challenges.";

  return {
    title: {
      template: `%s | ${siteName}`,
      default: siteName,
    },
    description,
    openGraph: {
      title: siteName,
      description,
      siteName,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
    },
    icons: [
      { rel: "icon", url: "/icon.svg", type: "image/svg+xml" }
    ],
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ceaprofessional.ng"),
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
