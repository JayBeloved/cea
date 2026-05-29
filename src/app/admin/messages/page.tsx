"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Mail, Trash2, CheckCircle2, Circle } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: any;
  read: boolean;
}

export default function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(items);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleReadStatus = async (msg: Message) => {
    try {
      await updateDoc(doc(db, "messages", msg.id), {
        read: !msg.read
      });
      setMessages(messages.map(m => m.id === msg.id ? { ...m, read: !m.read } : m));
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteDoc(doc(db, "messages", id));
        setMessages(messages.filter(m => m.id !== id));
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold tracking-tight text-primary">Inquiries</h1>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground animate-pulse">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <Mail className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">No messages yet</h3>
            <p className="text-muted-foreground">When visitors use the contact form, their messages will appear here.</p>
          </div>
        ) : (
          <div className="divide-y">
            {messages.map((msg) => (
              <div key={msg.id} className={`p-6 transition-colors ${msg.read ? 'bg-background hover:bg-muted/30' : 'bg-primary/5 hover:bg-primary/10'}`}>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className={`text-lg font-heading ${msg.read ? 'font-medium' : 'font-bold'}`}>
                      {msg.subject || "No Subject"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      From: <span className="font-medium text-foreground">{msg.name}</span> &lt;{msg.email}&gt;
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-xs text-muted-foreground mr-4">
                      {msg.createdAt ? new Date(msg.createdAt.toDate()).toLocaleString() : ''}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => toggleReadStatus(msg)} title={msg.read ? "Mark as unread" : "Mark as read"}>
                      {msg.read ? <CheckCircle2 className="h-4 w-4 text-muted-foreground" /> : <Circle className="h-4 w-4 text-primary" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(msg.id)} title="Delete message">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="bg-background border rounded-lg p-4 text-sm text-foreground/90 whitespace-pre-wrap">
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
