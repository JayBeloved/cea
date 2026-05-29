import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { AnimateIn } from "@/components/ui/animate-in";

export const revalidate = 60;

export default async function BlogIndexPage() {
  const q = query(
    collection(db, "posts"), 
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  const allPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
  const posts = allPosts.filter(post => !post.isDraft);

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4">
        
        <AnimateIn direction="up" delay={0.1} className="max-w-3xl mb-16">
          <h1 className="font-heading text-5xl font-bold text-primary mb-6">Insights & Perspectives</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Expert analysis, industry trends, and strategic foresight from the minds at CEA Professional.
          </p>
        </AnimateIn>

        {posts.length === 0 ? (
          <div className="py-24 text-center border rounded-xl bg-muted/10">
            <h3 className="text-2xl font-heading font-bold text-muted-foreground">No publications available yet.</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any, index: number) => (
              <AnimateIn key={post.id} delay={0.1 * (index + 1)} direction="up">
                <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full border rounded-xl overflow-hidden bg-card hover:shadow-lg transition-all duration-300">
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <Calendar className="mr-2 h-4 w-4" />
                      {post.createdAt ? new Date(post.createdAt.toDate()).toLocaleDateString() : 'Recent'}
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-primary mb-4 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <div 
                      className="text-muted-foreground line-clamp-3 mb-8 prose prose-sm"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    <div className="mt-auto flex items-center text-sm font-bold uppercase tracking-wider text-primary">
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </AnimateIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
