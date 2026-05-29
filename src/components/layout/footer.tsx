import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export async function Footer() {
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
    <footer className="border-t bg-muted/20">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              {logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="CEA Professional Logo" className="h-10 w-auto object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
              )}
              <span className="font-heading font-bold text-2xl tracking-tight">CEA</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Premium professional services tailored to elevate your business. Expertise you can trust, execution you can rely on.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/services" className="hover:text-foreground transition-colors">Services</Link></li>
              <li><Link href="/team" className="hover:text-foreground transition-colors">Leadership</Link></li>
              <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Insights</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/blog" className="hover:text-foreground transition-colors">Latest Articles</Link></li>
              <li><Link href="/reports" className="hover:text-foreground transition-colors">Industry Reports</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} CEA Professional Services. All rights reserved.</p>
          <div className="space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
