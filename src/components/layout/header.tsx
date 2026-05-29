import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export async function Header() {
  let logoUrl = "";
  try {
    const generalSnap = await getDoc(doc(db, "settings", "general"));
    if (generalSnap.exists() && generalSnap.data().logoUrl) {
      logoUrl = generalSnap.data().logoUrl;
    }
  } catch (error) {
    console.error("Error fetching logo:", error);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="CEA Professional Logo" className="h-10 object-contain" />
          ) : (
            <span className="font-heading font-bold text-xl tracking-tight">CEA Professional</span>
          )}
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
            About Us
          </Link>
          <Link href="/services" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Services
          </Link>
          <Link href="/team" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Our Team
          </Link>
          <Link href="/blog" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Insights
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/contact" className={buttonVariants({ className: "hidden md:inline-flex" })}>
            Contact Us
          </Link>
        </div>
      </div>
    </header>
  );
}
