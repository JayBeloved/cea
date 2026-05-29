"use client";

import { useEffect, useState } from "react";
import { collection, query, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { ref, deleteObject } from "firebase/storage";

interface Entity {
  id: string;
  name: string;
  logoUrl?: string;
  type: "partner" | "client";
}

export default function EntitiesManager() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    try {
      const q = query(collection(db, "entities"));
      const querySnapshot = await getDocs(q);
      const fetchedEntities = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Entity[];
      setEntities(fetchedEntities);
    } catch (error) {
      console.error("Error fetching entities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (entity: Entity) => {
    if (confirm(`Are you sure you want to delete ${entity.name}?`)) {
      try {
        await deleteDoc(doc(db, "entities", entity.id));
        fetchEntities();
      } catch (err) {
        alert("Failed to delete entity");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold tracking-tight text-primary">Partners & Clients</h1>
        <Link href="/admin/entities/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Logo
        </Link>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground animate-pulse">Loading entities...</div>
        ) : entities.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">No logos uploaded yet</h3>
            <p className="text-muted-foreground mb-6">Upload client or partner logos to display on the public site.</p>
            <Link href="/admin/entities/new" className={buttonVariants({ variant: "outline" })}>
              <Plus className="mr-2 h-4 w-4" />
              Upload First Logo
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {entities.map((entity) => (
              <div key={entity.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  {entity.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={entity.logoUrl} alt={entity.name} className="h-10 w-auto object-contain bg-white rounded p-1" />
                  ) : (
                    <div className="h-10 w-10 bg-muted rounded flex items-center justify-center font-bold text-muted-foreground">
                      {entity.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{entity.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${entity.type === 'client' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                      {entity.type.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" disabled title="Editing coming soon">
                    <Edit className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(entity)}>
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
