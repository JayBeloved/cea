"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  headshotUrl: string;
  order: number;
}

export default function TeamManager() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const q = query(collection(db, "team"), orderBy("order", "asc"));
      const querySnapshot = await getDocs(q);
      const fetchedMembers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TeamMember[];
      setMembers(fetchedMembers);
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this team member?")) {
      await deleteDoc(doc(db, "team", id));
      fetchMembers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold tracking-tight text-primary">Team Members</h1>
        <Link href="/admin/team/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Link>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground animate-pulse">Loading team members...</div>
        ) : members.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">No team members yet</h3>
            <p className="text-muted-foreground mb-6">Add your leadership and consulting team members here.</p>
            <Link href="/admin/team/new" className={buttonVariants({ variant: "outline" })}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Member
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {members.map((member) => (
              <div key={member.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  {member.headshotUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.headshotUrl} alt={member.name} className="w-12 h-12 rounded-full object-cover border" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" disabled title="Editing coming soon">
                    <Edit className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)}>
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
