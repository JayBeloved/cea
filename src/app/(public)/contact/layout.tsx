import { DynamicSectionRenderer } from "@/components/public/DynamicSectionRenderer";

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
