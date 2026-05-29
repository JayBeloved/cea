"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Send, MapPin, Phone, Mail } from "lucide-react";
import { AnimateIn } from "@/components/ui/animate-in";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus("submitting");
    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        createdAt: new Date(),
        read: false
      });
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <AnimateIn direction="up" delay={0.1} className="max-w-3xl mb-16">
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-primary mb-6">Contact Us</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Reach out to our team of experts. We are ready to assist you with strategic clarity and transformational insights.
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
          <AnimateIn direction="up" delay={0.2} className="lg:col-span-1 space-y-12">
            <div>
              <h3 className="font-heading text-2xl font-bold mb-6">Global Headquarters</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-primary mr-4 shrink-0" />
                  <p className="text-muted-foreground">123 Strategy Avenue<br />Suite 400<br />Lagos, Nigeria</p>
                </div>
                <div className="flex items-center">
                  <Phone className="h-6 w-6 text-primary mr-4 shrink-0" />
                  <p className="text-muted-foreground">+234 (0) 123 456 7890</p>
                </div>
                <div className="flex items-center">
                  <Mail className="h-6 w-6 text-primary mr-4 shrink-0" />
                  <p className="text-muted-foreground">contact@ceaprofessional.ng</p>
                </div>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn direction="up" delay={0.3} className="lg:col-span-2">
            <div className="bg-card border rounded-2xl p-8 md:p-12 shadow-sm">
              {status === "success" ? (
                <div className="text-center py-16">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-heading text-3xl font-bold text-primary mb-4">Message Sent</h3>
                  <p className="text-muted-foreground text-lg mb-8">Thank you for reaching out. A member of our team will get back to you shortly.</p>
                  <Button onClick={() => setStatus("idle")} variant="outline" size="lg">Send another message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Full Name *</label>
                      <input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full h-12 px-4 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary">Email Address *</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full h-12 px-4 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="jane@company.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary">Subject</label>
                    <input
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full h-12 px-4 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary">Message *</label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full h-40 p-4 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Tell us about your project or inquiry..."
                    />
                  </div>
                  <div className="pt-4">
                    <Button type="submit" size="lg" className="w-full md:w-auto h-14 px-12 text-lg" disabled={status === "submitting"}>
                      {status === "submitting" ? "Sending..." : "Send Message"}
                      <Send className="ml-2 h-5 w-5" />
                    </Button>
                    {status === "error" && (
                      <p className="text-destructive mt-4 text-sm">An error occurred. Please try again later.</p>
                    )}
                  </div>
                </form>
              )}
            </div>
          </AnimateIn>
        </div>

      </div>
    </div>
  );
}
