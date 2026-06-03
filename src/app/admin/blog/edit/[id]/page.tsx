"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { buttonVariants, Button } from "@/components/ui/button";
import { TipTapEditor } from "@/components/admin/TipTapEditor";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { ArrowLeft, Save, Send } from "lucide-react";
import Link from "next/link";

export default function EditBlogPost() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const docSnap = await getDoc(doc(db, "posts", id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title || "");
        setContent(data.content || "");
      } else {
        router.push("/admin/blog");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (isDraft: boolean) => {
    if (!title) {
      alert("Please enter a title");
      return;
    }

    setIsSubmitting(true);
    try {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      
      const updateData: any = {
        title,
        slug,
        content,
        isDraft,
      };

      if (!isDraft) {
        updateData.publishedAt = serverTimestamp();
      }

      await updateDoc(doc(db, "posts", id), updateData);
      router.push("/admin/blog");
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Failed to save post");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center animate-pulse">Loading post...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/blog" className={buttonVariants({ variant: "ghost", size: "icon" })}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-primary">Edit Post</h1>
        </div>
        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            onClick={() => handleSave(true)} 
            disabled={isSubmitting}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button 
            onClick={() => handleSave(false)} 
            disabled={isSubmitting}
          >
            <Send className="mr-2 h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>

      <div className="space-y-6 bg-card border rounded-lg p-6">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="title">Post Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-12 px-4 rounded-md border bg-background text-lg font-heading font-semibold ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="e.g. The Future of Corporate Strategy"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Content</label>
          <TipTapEditor content={content} onChange={setContent} />
        </div>
      </div>
    </div>
  );
}
