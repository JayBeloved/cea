"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase/client";
import { Upload, Loader2, Image as ImageIcon } from "lucide-react";

export default function ThemeSettingsPage() {
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const generalRef = doc(db, "settings", "general");
      const generalSnap = await getDoc(generalRef);

      if (generalSnap.exists()) {
        setLogoUrl(generalSnap.data().logoUrl || "");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, `settings/logo_${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      let downloadUrl = await getDownloadURL(storageRef);
      
      // Force alt=media for tokenless images if missing
      if (!downloadUrl.includes("alt=media")) {
        downloadUrl += (downloadUrl.includes("?") ? "&" : "?") + "alt=media";
      }

      // Save to Firestore
      await setDoc(doc(db, "settings", "general"), {
        logoUrl: downloadUrl,
        updatedAt: new Date()
      }, { merge: true });

      setLogoUrl(downloadUrl);
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Failed to upload logo. Please check Firebase rules.");
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-primary">Site Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your site's global appearance.</p>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-8">
        {loading ? (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="border-b pb-8">
              <h2 className="text-xl font-heading font-bold mb-4">Site Logo</h2>
              <div className="flex items-start space-x-8">
                <div className="h-32 w-48 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/20 relative overflow-hidden">
                  {logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoUrl} alt="Site Logo" className="h-full w-full object-contain p-2" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground opacity-50" />
                  )}
                  {uploadingLogo && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload your company logo. This will be displayed in the main navigation header and footer across the entire site. We recommend a high-resolution PNG with a transparent background.
                  </p>
                  <div>
                    <input
                      type="file"
                      id="logo-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                    />
                    <label htmlFor="logo-upload" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" />
                      {logoUrl ? "Change Logo" : "Upload Logo"}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
