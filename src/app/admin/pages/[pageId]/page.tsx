"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { TipTapEditor } from "@/components/admin/TipTapEditor";

// Schema definitions for each page so we know what fields to render
const PAGE_SCHEMAS: Record<string, { label: string; fields: { key: string; label: string; type: 'text' | 'textarea' | 'image' | 'richtext'; description?: string }[] }> = {
  home: {
    label: "Home Page",
    fields: [
      { key: "heroTitle", label: "Hero Title", type: "text", description: "The main headline on the homepage" },
      { key: "heroSubtitle", label: "Hero Subtitle", type: "textarea", description: "The text below the main headline" },
      { key: "heroImageUrls", label: "Hero Background Image URLs", type: "textarea", description: "Paste image URLs from the Media Gallery, one per line. If you provide multiple, they will automatically display as a slideshow." },
      { key: "servicesHeadline", label: "Services Section Headline", type: "text" },
    ]
  },
  about: {
    label: "About Us",
    fields: [
      { key: "pageTitle", label: "Page Title", type: "text" },
      { key: "missionStatement", label: "Mission Statement", type: "richtext" },
      { key: "visionStatement", label: "Vision Statement", type: "richtext" },
    ]
  },
  services: {
    label: "Services",
    fields: [
      { key: "pageTitle", label: "Page Title", type: "text" },
      { key: "introText", label: "Introduction Text", type: "textarea" },
    ]
  }
};

export default function PageEditor() {
  const params = useParams();
  const pageId = params.pageId as string;
  const router = useRouter();
  
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const schema = PAGE_SCHEMAS[pageId];

  useEffect(() => {
    if (!schema) {
      router.push("/admin/pages");
      return;
    }
    fetchPageData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  const fetchPageData = async () => {
    try {
      const docRef = doc(db, "pages", pageId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data().sections || {});
      } else {
        // Initialize with empty strings
        const emptyData: Record<string, string> = {};
        schema.fields.forEach(f => {
          emptyData[f.key] = "";
        });
        setData(emptyData);
      }
    } catch (error) {
      console.error("Error fetching page data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, "pages", pageId), {
        sections: data,
        updatedAt: new Date()
      }, { merge: true });
      alert("Page saved successfully!");
    } catch (error) {
      console.error("Error saving page:", error);
      alert("Failed to save page.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  if (!schema) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center space-x-4">
        <Link href="/admin/pages" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-3xl font-heading font-bold tracking-tight text-primary">Edit {schema.label}</h1>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground animate-pulse">Loading page content...</div>
        ) : (
          <form onSubmit={handleSave} className="p-8 space-y-8">
            
            {schema.fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="text-sm font-medium text-foreground">{field.label}</label>
                {field.description && <p className="text-xs text-muted-foreground mb-2">{field.description}</p>}
                
                {field.type === 'text' && (
                  <input
                    type="text"
                    value={data[field.key] || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full h-10 px-3 rounded-md border bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                )}

                {field.type === 'textarea' && (
                  <textarea
                    value={data[field.key] || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full min-h-[100px] p-3 rounded-md border bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                )}

                {field.type === 'image' && (
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      value={data[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      placeholder="Paste image URL from Media Gallery"
                      className="w-full h-10 px-3 rounded-md border bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <Link href="/admin/gallery" target="_blank" className={buttonVariants({ variant: "outline" })}>
                      Open Gallery
                    </Link>
                  </div>
                )}

                {field.type === 'richtext' && (
                  <TipTapEditor 
                    content={data[field.key] || ""} 
                    onChange={(val) => handleChange(field.key, val)} 
                  />
                )}
              </div>
            ))}

            <div className="pt-6 border-t flex justify-end">
              <Button type="submit" disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
