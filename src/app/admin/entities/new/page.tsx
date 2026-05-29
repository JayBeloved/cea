"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function NewEntity() {
  const [name, setName] = useState("");
  const [type, setType] = useState<"client" | "partner">("client");
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
    if (!name || !file) {
      alert("Please provide a name and upload a logo.");
      return;
    }

    setIsSubmitting(true);
    try {
      const storageRef = ref(storage, `entities/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      const logoUrl = await new Promise((resolve, reject) => {
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

      await addDoc(collection(db, "entities"), {
        name,
        type,
        logoUrl,
      });

      router.push("/admin/entities");
    } catch (error) {
      console.error("Error creating entity:", error);
      alert("Failed to save logo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div className="flex items-center space-x-4">
        <Link href="/admin/entities" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-3xl font-heading font-bold tracking-tight text-primary">Add Logo</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-8 bg-card border rounded-lg p-8 shadow-sm">
        <div className="space-y-4">
          <label className="text-sm font-medium">Upload Logo (Transparent PNG recommended) *</label>
          <div className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 text-center h-48 bg-muted/20 relative overflow-hidden">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Preview" className="h-full object-contain p-4" />
            ) : (
              <>
                <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-4">Click below to browse</p>
              </>
            )}
            <input
              type="file"
              id="logoUpload"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity ${preview ? '' : 'opacity-100 bg-transparent'}`}>
              <label htmlFor="logoUpload" className={buttonVariants({ variant: preview ? "secondary" : "default", size: "sm", className: "cursor-pointer" })}>
                {preview ? "Change Logo" : "Select Logo"}
              </label>
            </div>
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">Company Name *</label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 rounded-md border bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="e.g. ACME Corp"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Type *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full h-10 px-3 rounded-md border bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="client">Client</option>
              <option value="partner">Partner</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t">
          <Button type="submit" disabled={isSubmitting} className="min-w-32">
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Uploading..." : "Save Logo"}
          </Button>
        </div>
      </form>
    </div>
  );
}
