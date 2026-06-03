import { DynamicSectionRenderer } from "@/components/public/DynamicSectionRenderer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Reach out to our team of experts for strategic clarity and transformational insights.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      {/* Custom Dynamic Sections */}
      <DynamicSectionRenderer pageId="contact" />
    </>
  );
}
