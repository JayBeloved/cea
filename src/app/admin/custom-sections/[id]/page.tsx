"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const SECTION_TYPES = [
  { id: "cta", name: "Call to Action (CTA)" },
  { id: "text", name: "Text Block" },
  { id: "image", name: "Image Block" },
];

const AVAILABLE_PAGES = [
  { id: "home", name: "Home" },
  { id: "about", name: "About" },
  { id: "services", name: "Services" },
  { id: "team", name: "Team" },
  { id: "contact", name: "Contact" },
  { id: "blog", name: "Blog" },
];

export default function SectionEditor() {
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [type, setType] = useState("cta");
  const [pages, setPages] = useState<string[]>([]);
  const [order, setOrder] = useState(0);
  const [content, setContent] = useState<Record<string, string>>({
    headline: "",
    subtext: "",
    buttonText: "",
    buttonLink: "",
    textBody: ""
  });
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetchSection();
    }
  }, [id, isNew]);

  const fetchSection = async () => {
    try {
      const docSnap = await getDoc(doc(db, "custom_sections", id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || "");
        setType(data.type || "cta");
        setPages(data.pages || []);
        setOrder(data.order || 0);
        setContent(data.content || {});
      } else {
        router.push("/admin/custom-sections");
      }
    } catch (error) {
      console.error("Error fetching section:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const data = {
      name,
      type,
      pages,
      order,
      content,
      updatedAt: new Date()
    };

    try {
      if (isNew) {
        await addDoc(collection(db, "custom_sections"), { ...data, createdAt: new Date() });
      } else {
        await setDoc(doc(db, "custom_sections", id), data, { merge: true });
      }
      router.push("/admin/custom-sections");
    } catch (error) {
      console.error("Error saving section:", error);
      alert("Failed to save section.");
      setSaving(false);
    }
  };

  const togglePage = (pageId: string) => {
    setPages(prev => 
      prev.includes(pageId) ? prev.filter(p => p !== pageId) : [...prev, pageId]
    );
  };

  const updateContent = (key: string, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return <div className="p-8 text-center animate-pulse">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center space-x-4">
        <Link href="/admin/custom-sections" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-3xl font-heading font-bold tracking-tight text-primary">
          {isNew ? "New Custom Section" : "Edit Section"}
        </h1>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-card border rounded-lg p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Internal Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Home Page Footer CTA"
                className="w-full h-10 px-3 rounded-md border bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Section Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full h-10 px-3 rounded-md border bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {SECTION_TYPES.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Display on Pages</label>
            <div className="flex flex-wrap gap-3 mt-2">
              {AVAILABLE_PAGES.map(p => (
                <label key={p.id} className="flex items-center space-x-2 border px-4 py-2 rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={pages.includes(p.id)}
                    onChange={() => togglePage(p.id)}
                    className="rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{p.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Order Index (Sort Priority)</label>
            <input
              type="number"
              value={order}
              onChange={e => setOrder(Number(e.target.value))}
              className="w-full max-w-[200px] h-10 px-3 rounded-md border bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <p className="text-xs text-muted-foreground">Lower numbers appear first (e.g., 0, 1, 2).</p>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-8 space-y-6">
          <h2 className="text-xl font-heading font-bold mb-4">Content Configuration</h2>
          
          {type === "cta" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Headline</label>
                <input
                  type="text"
                  value={content.headline || ""}
                  onChange={e => updateContent("headline", e.target.value)}
                  className="w-full h-10 px-3 rounded-md border bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subtext</label>
                <textarea
                  value={content.subtext || ""}
                  onChange={e => updateContent("subtext", e.target.value)}
                  className="w-full min-h-[80px] p-3 rounded-md border bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Button Text</label>
                  <input
                    type="text"
                    value={content.buttonText || ""}
                    onChange={e => updateContent("buttonText", e.target.value)}
                    className="w-full h-10 px-3 rounded-md border bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Button Link</label>
                  <input
                    type="text"
                    value={content.buttonLink || ""}
                    onChange={e => updateContent("buttonLink", e.target.value)}
                    placeholder="e.g. /contact"
                    className="w-full h-10 px-3 rounded-md border bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Background Image URL (Optional)</label>
                <input
                  type="text"
                  value={content.bgImageUrl || ""}
                  onChange={e => updateContent("bgImageUrl", e.target.value)}
                  placeholder="Paste URL from Media Gallery for a beautiful background"
                  className="w-full h-10 px-3 rounded-md border bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>
          )}

          {type === "text" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Text Body</label>
                <textarea
                  value={content.textBody || ""}
                  onChange={e => updateContent("textBody", e.target.value)}
                  className="w-full min-h-[150px] p-3 rounded-md border bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Supports basic HTML formatting if needed."
                />
              </div>
            </div>
          )}

          {type === "image" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Image URL</label>
                <input
                  type="text"
                  value={content.imageUrl || ""}
                  onChange={e => updateContent("imageUrl", e.target.value)}
                  className="w-full h-10 px-3 rounded-md border bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Paste URL from Media Gallery"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Image Alt Text (for SEO and accessibility)</label>
                <input
                  type="text"
                  value={content.imageAlt || ""}
                  onChange={e => updateContent("imageAlt", e.target.value)}
                  className="w-full h-10 px-3 rounded-md border bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Section"}
          </Button>
        </div>
      </form>
    </div>
  );
}
