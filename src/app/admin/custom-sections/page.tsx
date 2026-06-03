"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Blocks } from "lucide-react";
import Link from "next/link";

export default function CustomSectionsPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const q = query(collection(db, "custom_sections"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      setSections(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching sections:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this custom section?")) {
      await deleteDoc(doc(db, "custom_sections", id));
      fetchSections();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-primary">Custom Sections</h1>
          <p className="text-muted-foreground mt-2">Build reusable components and inject them into public pages.</p>
        </div>
        <Link href="/admin/custom-sections/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" /> Add Section
        </Link>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-muted rounded-lg"></div>
            <div className="h-24 bg-muted rounded-lg"></div>
          </div>
        ) : sections.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Blocks className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-2">No sections yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">Create your first custom section to display reusable blocks like Calls to Action.</p>
              <Link href="/admin/custom-sections/new" className={buttonVariants({ variant: "outline" })}>
                <Plus className="mr-2 h-4 w-4" /> Create Section
              </Link>
            </CardContent>
          </Card>
        ) : (
          sections.map((section) => (
            <Card key={section.id} className="overflow-hidden">
              <div className="flex items-center justify-between p-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold uppercase rounded-md tracking-wider">
                      {section.type}
                    </span>
                    <h3 className="font-heading text-xl font-bold">{section.name || "Untitled Section"}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Displays on: {section.pages?.join(", ") || "None"} • Order: {section.order}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/admin/custom-sections/${section.id}`} className={buttonVariants({ variant: "outline", size: "icon" })}>
                    <Edit className="h-4 w-4" />
                  </Link>
                  <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(section.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
