import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Image as ImageIcon, LayoutTemplate, Settings, Users } from "lucide-react";

export default function GuidePage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight text-primary">User Manual</h1>
        <p className="text-muted-foreground mt-2">Welcome to the CEA Professional Content Management System (CMS). Follow these guides to manage your website.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <LayoutTemplate className="mr-3 h-5 w-5 text-primary" />
              Pages & Hero Slideshow
            </CardTitle>
            <CardDescription>Managing your core public pages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p><strong>Editing Text:</strong> Navigate to the <strong>Pages</strong> tab. Select a page (like Home, About, or Services) to edit its headlines and text blocks.</p>
            <p><strong>Hero Slideshow (Home Page):</strong> The Home Page features a dynamic slideshow in the Hero section. Under the "Hero Background Image URLs" field, you can paste multiple image URLs separated by commas. The system will automatically fade between these images every 5 seconds.</p>
            <p><strong>How to get URLs:</strong> Go to the <strong>Media Gallery</strong> tab, upload an image, click "Copy Link", and paste that link into the field.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <FileText className="mr-3 h-5 w-5 text-primary" />
              Blog & Articles
            </CardTitle>
            <CardDescription>Publishing insights and news</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p><strong>Creating Posts:</strong> Go to the <strong>Blog</strong> tab and click "New Post".</p>
            <p><strong>Formatting:</strong> Use the rich text editor to bold text, create lists, and structure your article with headings. Text formatting will automatically match your site's professional styling.</p>
            <p><strong>Publishing:</strong> You can save a post as a "Draft" to hide it from the public, or click "Publish" to make it live immediately on the website.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <ImageIcon className="mr-3 h-5 w-5 text-primary" />
              Media Gallery
            </CardTitle>
            <CardDescription>Centralized image storage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>The Media Gallery is your central repository for all images used across the site.</p>
            <p>Upload high-quality images here first. Once uploaded, you can copy their links and use them in Pages (like the Hero Slideshow) or Team Member profiles.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Users className="mr-3 h-5 w-5 text-primary" />
              Team & Entities
            </CardTitle>
            <CardDescription>Managing people and clients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p><strong>Team Members:</strong> Manage your firm's leadership under the <strong>Team</strong> tab. You can add their names, roles, biographies, and a link to their profile photo.</p>
            <p><strong>Clients & Partners (Entities):</strong> Under the <strong>Entities</strong> tab, you can add client logos. These logos appear in the "Trusted By" carousel on the Home Page. Make sure to upload logos with transparent backgrounds.</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Settings className="mr-3 h-5 w-5 text-primary" />
              Site Settings & Logo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>Navigate to <strong>Settings</strong> to update your global site logo. When you upload a new logo here, it instantly updates in the navigation bar, the footer, and the browser tab icon (favicon).</p>
            <p><em>Note: Next.js aggressively caches some pages for fast loading. If a change doesn't appear immediately on the public site, refresh the page or wait up to 60 seconds for the cache to clear.</em></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
