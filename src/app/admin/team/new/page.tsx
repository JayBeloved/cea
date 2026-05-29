"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TipTapEditor } from "@/components/admin/TipTapEditor";
import { collection, addDoc, getDocs, query } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase/client";
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NewTeamMember() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role) {
      alert("Name and Role are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      let headshotUrl = "";

      // 1. Upload image if exists
      if (file) {
        const storageRef = ref(storage, `team/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        headshotUrl = await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            },
            (error) => reject(error),
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            }
          );
        });
      }

      // 2. Figure out the order (append to end)
      const q = query(collection(db, "team"));
      const snapshot = await getDocs(q);
      const order = snapshot.docs.length;

      // 3. Save to Firestore
      await addDoc(collection(db, "team"), {
        name,
        role,
        bio,
        headshotUrl,
        order,
      });

      router.push("/admin/team");
    } catch (error) {
      console.error("Error creating team member:", error);
      alert("Failed to save team member.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="flex items-center space-x-4">
        <Link href="/admin/team" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-3xl font-heading font-bold tracking-tight text-primary">Add Team Member</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-8 bg-card border rounded-lg p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Headshot Upload */}
          <div className="col-span-1 space-y-4">
            <label className="text-sm font-medium">Headshot</label>
            <div className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 text-center aspect-square bg-muted/20 relative overflow-hidden">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <>
                  <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">Upload a high-quality professional portrait</p>
                </>
              )}
              <input
                type="file"
                id="headshot"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <div className={`absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity ${preview ? '' : 'opacity-100 bg-transparent'}`}>
                <label htmlFor="headshot" className={buttonVariants({ variant: preview ? "secondary" : "default", size: "sm", className: "cursor-pointer" })}>
                  {preview ? "Change Photo" : "Select Photo"}
                </label>
              </div>
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">Full Name *</label>
              <input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3 rounded-md border bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="e.g. Jane Doe"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="role">Job Title / Role *</label>
              <input
                id="role"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-10 px-3 rounded-md border bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="e.g. Managing Partner"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Biography</label>
              <p className="text-xs text-muted-foreground mb-2">Write a detailed professional bio. This will appear on their individual profile.</p>
              <TipTapEditor content={bio} onChange={setBio} />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t">
          <Button type="submit" disabled={isSubmitting} className="min-w-32">
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Member"}
          </Button>
        </div>
      </form>
    </div>
  );
}
