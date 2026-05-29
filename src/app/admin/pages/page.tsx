import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutTemplate, Home, Info, Briefcase, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function PagesManager() {
  const pages = [
    { id: "home", title: "Home Page", description: "Edit the Hero section and main headlines", icon: Home },
    { id: "about", title: "About Us", description: "Edit the firm's mission, vision, and story", icon: Info },
    { id: "services", title: "Services", description: "Edit the service descriptions and offerings", icon: Briefcase },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight text-primary">Pages</h1>
        <p className="text-muted-foreground mt-2">Manage the content of your public facing pages.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => {
          const Icon = page.icon;
          return (
            <Link key={page.id} href={`/admin/pages/${page.id}`} className="group block">
              <Card className="h-full transition-colors hover:border-primary/50 hover:bg-muted/20">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardTitle className="mt-4 text-xl">{page.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{page.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
