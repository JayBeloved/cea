"use client";

import { useState, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { storage, db } from "@/lib/firebase/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Upload, Trash2, Copy, Check, Image as ImageIcon } from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  name: string;
  path: string;
  createdAt: any;
}

export default function GalleryManager() {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MediaItem[];
      setImages(items);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(p);
      },
      (error) => {
        console.error("Upload error:", error);
        setUploading(false);
        alert("Failed to upload image");
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        
        // Save metadata to Firestore
        await addDoc(collection(db, "gallery"), {
          url: downloadURL,
          name: file.name,
          path: uploadTask.snapshot.ref.fullPath,
          createdAt: new Date(),
        });
        
        setUploading(false);
        setProgress(0);
        fetchGallery();
      }
    );
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm("Delete this image? It might break pages that are currently using it.")) return;

    try {
      // Delete from Storage
      const storageRef = ref(storage, item.path);
      await deleteObject(storageRef);
      
      // Delete metadata from Firestore
      await deleteDoc(doc(db, "gallery", item.id));
      
      fetchGallery();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image.");
    }
  };

  const copyToClipboard = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-primary">Media Gallery</h1>
          <p className="text-muted-foreground mt-1">Upload and manage images to use across your website.</p>
        </div>
        <div>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <label htmlFor="file-upload">
            <span className={buttonVariants({ className: "cursor-pointer" })}>
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? `Uploading ${Math.round(progress)}%` : "Upload Image"}
            </span>
          </label>
        </div>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground animate-pulse">Loading gallery...</div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
              <ImageIcon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2">Your gallery is empty</h3>
            <p className="text-muted-foreground max-w-md">
              Upload images here, such as Hero backgrounds, logos, or general photos, to use them in the Pages Editor or Blog posts.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {images.map((item) => (
              <div key={item.id} className="group relative rounded-lg border bg-background overflow-hidden aspect-square flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={item.url} 
                  alt={item.name} 
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
                  <div className="flex justify-end">
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleDelete(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-white truncate px-1 drop-shadow-md">{item.name}</p>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full text-xs h-8"
                      onClick={() => copyToClipboard(item.id, item.url)}
                    >
                      {copiedId === item.id ? (
                        <><Check className="mr-1 h-3 w-3" /> Copied</>
                      ) : (
                        <><Copy className="mr-1 h-3 w-3" /> Copy URL</>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
