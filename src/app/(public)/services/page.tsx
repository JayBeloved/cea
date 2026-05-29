import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { BarChart3, Briefcase, Globe2, ShieldCheck, Zap, Users2, Landmark, Lightbulb, PieChart, Scale } from "lucide-react";
import { AnimateIn } from "@/components/ui/animate-in";

const iconMap: Record<string, any> = {
  Briefcase, BarChart3, Globe2, ShieldCheck, Zap, Users2, Landmark, Lightbulb, PieChart, Scale
};

export const revalidate = 60;

export default async function ServicesPage() {
  const pageDoc = await getDoc(doc(db, "pages", "services"));
  const data = pageDoc.exists() ? pageDoc.data().sections || {} : {};

  const servicesQuery = query(collection(db, "services"), orderBy("order", "asc"));
  const servicesSnap = await getDocs(servicesQuery);
  const services = servicesSnap.docs.map(d => ({ id: d.id, ...d.data() as any }));

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4">
        
        <AnimateIn direction="up" delay={0.1} className="max-w-3xl mb-20">
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-primary mb-6">
            {data.pageTitle || "Our Capabilities"}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {data.introText || "We deliver end-to-end strategic solutions designed to solve your most complex challenges and drive sustainable growth."}
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = iconMap[service.iconName] || Briefcase;
            return (
              <AnimateIn key={service.id} delay={0.1 * (index + 1)} direction="up" className="group border p-10 hover:shadow-xl transition-all duration-300 bg-card rounded-2xl relative" id={service.id}>
                <div className="h-16 w-16 bg-primary/5 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </AnimateIn>
            );
          })}
        </div>

      </div>
    </div>
  );
}
