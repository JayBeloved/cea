import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { AnimateIn } from "@/components/ui/animate-in";
import { DynamicSectionRenderer } from "@/components/public/DynamicSectionRenderer";

export const revalidate = 60;

export default async function TeamPage() {
  const q = query(collection(db, "team"), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  const team = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4">
        
        <AnimateIn direction="up" delay={0.1} className="max-w-3xl mb-16">
          <h1 className="font-heading text-5xl font-bold text-primary mb-6">Our Leadership</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Meet the experienced professionals driving strategic clarity and delivering transformative results for our clients globally.
          </p>
        </AnimateIn>

        {team.length === 0 ? (
          <div className="py-24 text-center border rounded-xl bg-muted/10">
            <h3 className="text-2xl font-heading font-bold text-muted-foreground">Team profiles coming soon.</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {team.map((member: any, index: number) => (
              <AnimateIn key={member.id} delay={0.1 * (index + 1)} direction="up" className="group">
                <div className="aspect-[4/5] bg-muted/30 rounded-2xl overflow-hidden mb-6">
                  {member.headshotUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={member.headshotUrl} 
                      alt={member.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale hover:grayscale-0"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl text-muted-foreground/30 font-heading font-bold">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-heading font-bold text-primary mb-1">{member.name}</h3>
                <p className="text-primary/70 font-medium mb-4">{member.role}</p>
                {member.bio && (
                  <div 
                    className="prose prose-sm text-muted-foreground line-clamp-4"
                    dangerouslySetInnerHTML={{ __html: member.bio }}
                  />
                )}
              </AnimateIn>
            ))}
          </div>
        )}
      </div>

      {/* Custom Dynamic Sections */}
      <DynamicSectionRenderer pageId="team" />
    </div>
  );
}
