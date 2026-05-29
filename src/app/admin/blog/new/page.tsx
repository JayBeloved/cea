"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buttonVariants, Button } from "@/components/ui/button";
import { TipTapEditor } from "@/components/admin/TipTapEditor";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { ArrowLeft, Save, Send } from "lucide-react";
import Link from "next/link";

export default function NewBlogPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSave = async (isDraft: boolean) => {
    if (!title) {
      alert("Please enter a title");
      return;
    }

    setIsSubmitting(true);
    try {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      
      await addDoc(collection(db, "posts"), {
        title,
        slug,
        content,
        isDraft,
        createdAt: serverTimestamp(),
        publishedAt: isDraft ? null : serverTimestamp(),
      });

      router.push("/admin/blog");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to save post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/blog" className={buttonVariants({ variant: "ghost", size: "icon" })}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-primary">New Post</h1>
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
