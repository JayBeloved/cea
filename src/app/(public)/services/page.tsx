import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { BarChart3, Briefcase, Globe2, ShieldCheck, Zap, Users2 } from "lucide-react";

export const revalidate = 60;

export default async function ServicesPage() {
  const pageDoc = await getDoc(doc(db, "pages", "services"));
  const data = pageDoc.exists() ? pageDoc.data().sections || {} : {};

  const services = [
    {
      title: "Corporate Strategy",
      description: "Navigate market disruptions and secure competitive advantage with our data-driven corporate strategy advisory.",
      icon: Briefcase
    },
    {
      title: "Financial Advisory",
      description: "Optimize capital structure, manage risk, and execute transformative M&A transactions with confidence.",
      icon: BarChart3
    },
    {
      title: "Digital Transformation",
      description: "Modernize operations and unlock new value streams through strategic technology implementation and process redesign.",
      icon: Globe2
    },
    {
      title: "Risk & Compliance",
      description: "Proactively identify vulnerabilities and establish robust governance frameworks to protect your enterprise.",
      icon: ShieldCheck
    },
    {
      title: "Operational Excellence",
      description: "Streamline workflows, reduce costs, and enhance organizational agility for sustained peak performance.",
      icon: Zap
    },
    {
      title: "Human Capital",
      description: "Design optimal organizational structures and talent strategies to align your workforce with your strategic objectives.",
      icon: Users2
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4">
        
        <div className="max-w-3xl mb-20">
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-primary mb-6">
            {data.pageTitle || "Our Capabilities"}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {data.introText || "We deliver end-to-end strategic solutions designed to solve your most complex challenges and drive sustainable growth."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="group border p-10 hover:shadow-xl transition-all duration-300 bg-card rounded-2xl">
                <div className="h-16 w-16 bg-primary/5 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
