import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { AnimateIn } from "@/components/ui/animate-in";

export const revalidate = 60;

export default async function AboutPage() {
  const pageDoc = await getDoc(doc(db, "pages", "about"));
  const data = pageDoc.exists() ? pageDoc.data().sections || {} : {};

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <AnimateIn direction="up" delay={0.1}>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-primary mb-12">
            {data.pageTitle || "About CEA Professional"}
          </h1>
        </AnimateIn>

        <div className="space-y-16">
          <AnimateIn direction="up" delay={0.2}>
            <section>
              <h2 className="font-heading text-3xl font-bold text-primary mb-6 border-b pb-4">Our Mission</h2>
              {data.missionStatement ? (
                <div 
                  className="prose prose-lg max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: data.missionStatement }}
                />
              ) : (
                <p className="text-xl text-muted-foreground leading-relaxed">
                  To empower enterprises with the strategic clarity, rigorous analysis, and operational foresight required to thrive in a complex global market.
                </p>
              )}
            </section>
          </AnimateIn>

          <AnimateIn direction="up" delay={0.3}>
            <section>
              <h2 className="font-heading text-3xl font-bold text-primary mb-6 border-b pb-4">Our Vision</h2>
              {data.visionStatement ? (
                <div 
                  className="prose prose-lg max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: data.visionStatement }}
                />
              ) : (
                <p className="text-xl text-muted-foreground leading-relaxed">
                  To be the undisputed standard of excellence in professional advisory services, trusted by the world's most ambitious organizations.
                </p>
              )}
            </section>
          </AnimateIn>
        </div>
      </div>
    </div>
  );
}
