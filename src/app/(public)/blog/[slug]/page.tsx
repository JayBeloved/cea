import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const revalidate = 60;

export async function generateStaticParams() {
  const q = query(collection(db, "posts"), where("isDraft", "==", false));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    slug: doc.data().slug,
  }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // We need to resolve params first in Next.js 15
  // Note: params is a promise in recent Next.js versions, but typically passed as resolved in some setups.
  // Actually, to be safe, we await it if it's a promise, but TS complains if we do that without defining it as one. 
  // Next 15 standard is to await params, let's cast it or just destructure safely.
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const q = query(collection(db, "posts"), where("slug", "==", slug));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    notFound();
  }

  const post = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as any;

  if (post.isDraft) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-12">
          <Link href="/blog" className={buttonVariants({ variant: "ghost", className: "mb-8 -ml-4 text-muted-foreground hover:text-primary" })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Insights
          </Link>
          
          <div className="flex items-center text-sm text-muted-foreground mb-6">
            <Calendar className="mr-2 h-4 w-4" />
            {post.createdAt ? new Date(post.createdAt.toDate()).toLocaleDateString() : 'Recent'}
          </div>
          
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-8 leading-tight">
            {post.title}
          </h1>
        </div>

        <div className="prose prose-lg md:prose-xl max-w-none prose-headings:font-heading prose-headings:text-primary prose-p:text-muted-foreground prose-a:text-blue-600">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    </article>
  );
}
