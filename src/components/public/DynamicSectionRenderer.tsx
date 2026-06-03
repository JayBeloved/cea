import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { AnimateIn } from "@/components/ui/animate-in";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface DynamicSectionRendererProps {
  pageId: string;
}

export async function DynamicSectionRenderer({ pageId }: DynamicSectionRendererProps) {
  let sections: any[] = [];
  try {
    const q = query(collection(db, "custom_sections"), where("pages", "array-contains", pageId));
    const snap = await getDocs(q);
    // Firebase requires a composite index to order by a different field than the where clause,
    // so we'll fetch and sort in memory since the array will be small.
    sections = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    sections.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error("Error fetching dynamic sections:", error);
    return null;
  }

  if (sections.length === 0) return null;

  return (
    <>
      {sections.map((section, index) => {
        const content = section.content || {};

        if (section.type === "cta") {
          let bgStyle = {};
          let overlay = null;
          if (content.bgImageUrl) {
            bgStyle = { backgroundImage: `url(${content.bgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' };
            overlay = <div className="absolute inset-0 bg-primary/80 z-0"></div>;
          }

          return (
            <section key={section.id} className="relative py-24 bg-primary text-primary-foreground overflow-hidden" style={bgStyle}>
              {overlay}
              <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
                <AnimateIn direction="up">
                  <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
                    {content.headline}
                  </h2>
                  {content.subtext && (
                    <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed font-light whitespace-pre-wrap">
                      {content.subtext}
                    </p>
                  )}
                  {content.buttonText && content.buttonLink && (
                    <Link 
                      href={content.buttonLink} 
                      className={buttonVariants({ size: "lg", className: "bg-white text-slate-900 hover:bg-slate-100 hover:text-slate-900 text-lg h-14 px-8 font-semibold shadow-lg transition-all" })}
                    >
                      {content.buttonText}
                    </Link>
                  )}
                </AnimateIn>
              </div>
            </section>
          );
        }

        if (section.type === "text") {
          return (
            <section key={section.id} className="py-16 md:py-24 bg-muted/10">
              <div className="container mx-auto px-4 max-w-4xl">
                <AnimateIn direction="up">
                  <div 
                    className="prose prose-lg max-w-none text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: content.textBody || "" }}
                  />
                </AnimateIn>
              </div>
            </section>
          );
        }

        if (section.type === "image") {
          if (!content.imageUrl) return null;
          return (
            <section key={section.id} className="py-12 md:py-16">
              <div className="container mx-auto px-4 max-w-5xl">
                <AnimateIn direction="up">
                  <div className="rounded-2xl overflow-hidden shadow-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={content.imageUrl} 
                      alt={content.imageAlt || "Section image"} 
                      className="w-full h-auto object-cover max-h-[70vh]"
                    />
                  </div>
                </AnimateIn>
              </div>
            </section>
          );
        }

        return null;
      })}
    </>
  );
}
