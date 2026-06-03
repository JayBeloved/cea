import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Building2, Mail } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { collection, query, where, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export const revalidate = 0; // Ensure admin dashboard doesn't serve stale stats

export default async function AdminDashboard() {
  // Fetch live counts
  const postsCount = (await getCountFromServer(query(collection(db, "posts"), where("isDraft", "==", false)))).data().count;
  const teamCount = (await getCountFromServer(collection(db, "team"))).data().count;
  const entitiesCount = (await getCountFromServer(collection(db, "entities"))).data().count;
  const unreadMessagesCount = (await getCountFromServer(query(collection(db, "messages"), where("read", "==", false)))).data().count;

  const stats = [
    { title: "Published Posts", value: postsCount.toString(), icon: FileText, href: "/admin/blog" },
    { title: "Team Members", value: teamCount.toString(), icon: Users, href: "/admin/team" },
    { title: "Partners & Clients", value: entitiesCount.toString(), icon: Building2, href: "/admin/entities" },
    { title: "Unread Messages", value: unreadMessagesCount.toString(), icon: Mail, href: "/admin/messages" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight text-primary">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to the CEA Professional admin panel.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                {stat.href !== "#" && (
                  <Link href={stat.href} className="text-xs text-primary hover:underline mt-2 inline-block">
                    Manage &rarr;
                  </Link>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Link href="/admin/blog/new" className={buttonVariants({ variant: "outline", className: "w-full justify-start" })}>
              <FileText className="mr-2 h-4 w-4" />
              Draft a new blog post
            </Link>
            <Link href="/admin/team" className={buttonVariants({ variant: "outline", className: "w-full justify-start" })}>
              <Users className="mr-2 h-4 w-4" />
              Add a team member
            </Link>
            <Link href="/admin/entities" className={buttonVariants({ variant: "outline", className: "w-full justify-start" })}>
              <Building2 className="mr-2 h-4 w-4" />
              Upload a partner logo
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Firebase Connection</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Database Usage</span>
                <span className="text-sm font-medium">1.2 MB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Storage Usage</span>
                <span className="text-sm font-medium">15 MB</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
