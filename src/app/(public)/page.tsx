import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BarChart3, Briefcase, Globe2, ShieldCheck, Zap, Users2, Landmark, Lightbulb, PieChart, Scale } from "lucide-react";
import { doc, getDoc, collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { AnimateIn } from "@/components/ui/animate-in";

const iconMap: Record<string, any> = {
  Briefcase, BarChart3, Globe2, ShieldCheck, Zap, Users2, Landmark, Lightbulb, PieChart, Scale
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  // Fetch home page content
  const pageDoc = await getDoc(doc(db, "pages", "home"));
  const pageData = pageDoc.exists() ? pageDoc.data().sections || {} : {};

  // Ensure Firebase Storage URLs have ?alt=media appended if missing (fixes JSON response issue)
  let heroImg = pageData.heroImageUrl || "";
  if (heroImg && heroImg.includes("firebasestorage.googleapis.com") && !heroImg.includes("alt=media")) {
    heroImg += "?alt=media";
  }

  // Fetch client logos
  const entitiesQuery = query(collection(db, "entities"), where("type", "==", "client"));
  const entitiesSnap = await getDocs(entitiesQuery);
  const clients = entitiesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  // Fetch featured services (limit to 3 for homepage)
  const servicesQuery = query(collection(db, "services"), orderBy("order", "asc"), limit(3));
  const servicesSnap = await getDocs(servicesQuery);
  const services = servicesSnap.docs.map(d => ({ id: d.id, ...d.data() as any }));
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden">
        {heroImg && (
          <div 
            className="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImg})` }}
          />
        )}
        <div className="container mx-auto px-4 relative z-10">
          <AnimateIn direction="up" delay={0.1} className="max-w-3xl">
            <h1 className="font-heading text-5xl md:text-7xl font-bold leading-tight mb-6">
              {pageData.heroTitle || "Strategic clarity in a complex world."}
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/80 mb-10 max-w-2xl leading-relaxed font-light whitespace-pre-wrap">
              {pageData.heroSubtitle || "We provide premium consulting, advisory, and professional services to propel your enterprise forward with precision."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/services" className={buttonVariants({ size: "lg", className: "bg-white text-primary hover:bg-white/90 text-lg h-14 px-8" })}>
                Explore Our Services
              </Link>
              <Link href="/contact" className={buttonVariants({ size: "lg", variant: "outline", className: "text-white border-white/30 hover:bg-white/10 hover:text-white text-lg h-14 px-8" })}>
                Speak to a Partner
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Trusted By / Logos Section */}
      <section className="py-12 border-b bg-muted/20">
        <AnimateIn direction="up" delay={0.3} className="container mx-auto px-4">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center mb-8">
            Trusted by industry leaders
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {clients.length > 0 ? (
              clients.map((client: any) => (
                client.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={client.id} src={client.logoUrl} alt={client.name} className="h-12 object-contain" />
                ) : (
                  <div key={client.id} className="font-heading font-bold text-2xl">{client.name}</div>
                )
              ))
            ) : (
              <>
                <div className="font-heading font-bold text-2xl">ACME Corp</div>
                <div className="font-heading font-bold text-2xl">Globex</div>
                <div className="font-heading font-bold text-2xl">Soylent</div>
              </>
            )}
          </div>
        </AnimateIn>
      </section>

      {/* Featured Services */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <AnimateIn direction="up" className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-primary">
                {pageData.servicesHeadline || "Capabilities that drive impact"}
              </h2>
              <p className="text-lg text-muted-foreground">
                Our multidisciplinary teams combine deep industry expertise with advanced analytics to deliver solutions that transform your business.
              </p>
            </div>
            <Link href="/services" className={buttonVariants({ variant: "ghost", className: "group flex items-center text-primary font-semibold" })}>
              View all capabilities 
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.length > 0 ? (
              services.map((service, idx) => {
                const Icon = iconMap[service.iconName] || Briefcase;
                return (
                  <AnimateIn key={service.id} delay={0.1 * (idx + 1)} direction="up" className="group border p-8 hover:shadow-lg transition-all duration-300 bg-card rounded-xl">
                    <Icon className="h-12 w-12 text-primary mb-6" />
                    <h3 className="font-heading text-2xl font-bold mb-4">{service.title}</h3>
                    <p className="text-muted-foreground mb-8 line-clamp-3">
                      {service.description}
                    </p>
                    <Link href={`/services#${service.id}`} className="text-sm font-bold uppercase tracking-wider text-primary group-hover:underline">
                      Learn more
                    </Link>
                  </AnimateIn>
                );
              })
            ) : (
              <AnimateIn direction="up" delay={0.2} className="group border p-8 hover:shadow-lg transition-all duration-300 bg-card rounded-xl">
                <Briefcase className="h-12 w-12 text-primary mb-6" />
                <h3 className="font-heading text-2xl font-bold mb-4">Corporate Strategy</h3>
                <p className="text-muted-foreground mb-8 line-clamp-3">
                  Navigate market disruptions and secure competitive advantage with our data-driven corporate strategy advisory.
                </p>
                <Link href="/services" className="text-sm font-bold uppercase tracking-wider text-primary group-hover:underline">
                  Learn more
                </Link>
              </AnimateIn>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
