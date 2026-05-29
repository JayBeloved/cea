"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface Post {
  id: string;
  title: string;
  slug: string;
  isDraft: boolean;
  createdAt: any;
}

export default function BlogManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedPosts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deleteDoc(doc(db, "posts", id));
      fetchPosts();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold tracking-tight text-primary">Blog Posts</h1>
        <Link href="/admin/blog/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Link>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground animate-pulse">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-6">Create your first blog post to get started.</p>
            <Link href="/admin/blog/new" className={buttonVariants({ variant: "outline" })}>
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {posts.map((post) => (
              <div key={post.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div>
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${post.isDraft ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {post.isDraft ? "Draft" : "Published"}
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">/{post.slug}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link href={`/admin/blog/edit/${post.id}`} className={buttonVariants({ variant: "ghost", size: "icon" })}>
                    <Edit className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
