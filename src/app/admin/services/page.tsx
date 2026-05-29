"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import * as Icons from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  order: number;
}

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const q = query(collection(db, "services"), orderBy("order", "asc"));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
      setServices(items);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      await deleteDoc(doc(db, "services", id));
      fetchServices();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold tracking-tight text-primary">Services</h1>
        <Link href="/admin/services/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Link>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground animate-pulse">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">No services defined yet</h3>
            <p className="text-muted-foreground mb-6">Create the services you offer so they appear on the homepage.</p>
            <Link href="/admin/services/new" className={buttonVariants({ variant: "outline" })}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Service
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {services.map((service) => {
              // @ts-ignore
              const Icon = Icons[service.iconName || "Briefcase"] || Icons.Briefcase;
              
              return (
                <div key={service.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-primary/10 rounded flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{service.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1 max-w-lg">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
