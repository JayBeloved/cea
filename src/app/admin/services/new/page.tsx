"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Save, Briefcase, BarChart3, Globe2, ShieldCheck, Zap, Users2, Landmark, Lightbulb, PieChart, Scale } from "lucide-react";
import Link from "next/link";

const AVAILABLE_ICONS = [
  { name: "Briefcase", icon: Briefcase },
  { name: "BarChart3", icon: BarChart3 },
  { name: "Globe2", icon: Globe2 },
  { name: "ShieldCheck", icon: ShieldCheck },
  { name: "Zap", icon: Zap },
  { name: "Users2", icon: Users2 },
  { name: "Landmark", icon: Landmark },
  { name: "Lightbulb", icon: Lightbulb },
  { name: "PieChart", icon: PieChart },
  { name: "Scale", icon: Scale },
];

export default function NewService() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [iconName, setIconName] = useState("Briefcase");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      alert("Title and description are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Figure out the order (append to end)
      const q = query(collection(db, "services"));
      const snapshot = await getDocs(q);
      const order = snapshot.docs.length;

      // Save to Firestore
      await addDoc(collection(db, "services"), {
        title,
        description,
        iconName,
        order,
      });

      router.push("/admin/services");
    } catch (error) {
      console.error("Error creating service:", error);
      alert("Failed to save service.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div className="flex items-center space-x-4">
        <Link href="/admin/services" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-3xl font-heading font-bold tracking-tight text-primary">Add Service</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-8 bg-card border rounded-lg p-8 shadow-sm">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="title">Service Title *</label>
            <input
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 px-3 rounded-md border bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="e.g. Corporate Strategy"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="description">Short Description *</label>
            <textarea
              id="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-24 p-3 rounded-md border bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Provide a concise 1-2 sentence description of this service."
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Select an Icon</label>
            <div className="grid grid-cols-5 gap-4">
              {AVAILABLE_ICONS.map((iconItem) => {
                const Icon = iconItem.icon;
                const isSelected = iconName === iconItem.name;
                return (
                  <button
                    key={iconItem.name}
                    type="button"
                    onClick={() => setIconName(iconItem.name)}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${isSelected ? 'border-primary bg-primary/5 text-primary' : 'border-transparent bg-muted hover:bg-muted/80'}`}
                  >
                    <Icon className="h-6 w-6 mb-2" />
                    <span className="text-[10px] font-medium">{iconItem.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t">
          <Button type="submit" disabled={isSubmitting} className="min-w-32">
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Service"}
          </Button>
        </div>
      </form>
    </div>
  );
}
