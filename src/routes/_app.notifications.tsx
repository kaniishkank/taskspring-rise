import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck, CheckCircle2, Clock, MessageSquareWarning, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notifications as seed } from "@/lib/mock/data";
import { EmptyState } from "@/components/app/empty-state";
import type { Notification } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/notifications")({
  component: NotificationsPage,
});

const iconMap = {
  assignment: UserPlus,
  reminder: Clock,
  approval: CheckCircle2,
  rejection: MessageSquareWarning,
} as const;

const toneMap = {
  assignment: "bg-info/15 text-info",
  reminder: "bg-warning/20 text-warning-foreground dark:text-warning",
  approval: "bg-success/15 text-success",
  rejection: "bg-destructive/15 text-destructive",
} as const;

function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>(seed);
  const markAll = () => setItems((p) => p.map((n) => ({ ...n, read: true })));
  const mark = (id: string) => setItems((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const tabs: { value: string; label: string; filter: (n: Notification) => boolean }[] = [
    { value: "all", label: "All", filter: () => true },
    { value: "assignment", label: "Assignments", filter: (n) => n.category === "assignment" },
    { value: "reminder", label: "Reminders", filter: (n) => n.category === "reminder" },
    { value: "approval", label: "Approvals", filter: (n) => n.category === "approval" },
    { value: "rejection", label: "Rejections", filter: (n) => n.category === "rejection" },
  ];

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Stay on top of every assignment, reminder, and review."
        actions={<Button variant="outline" onClick={markAll}><CheckCheck className="mr-1.5 h-4 w-4" />Mark all as read</Button>}
      />
      <Tabs defaultValue="all">
        <TabsList>
          {tabs.map((t) => <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>)}
        </TabsList>
        {tabs.map((t) => {
          const list = items.filter(t.filter);
          return (
            <TabsContent key={t.value} value={t.value}>
              {list.length === 0 ? (
                <EmptyState icon={Bell} title="You're all caught up" description="No notifications in this category." />
              ) : (
                <ul className="overflow-hidden rounded-xl border bg-card shadow-sm">
                  {list.map((n) => {
                    const Icon = iconMap[n.category];
                    return (
                      <li
                        key={n.id}
                        onClick={() => mark(n.id)}
                        className={cn("flex cursor-pointer items-start gap-4 border-b p-4 transition last:border-0 hover:bg-accent/40", !n.read && "bg-primary/5")}
                      >
                        <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full", toneMap[n.category])}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-3">
                            <h4 className="truncate text-sm font-semibold">{n.title}</h4>
                            <span className="shrink-0 text-xs text-muted-foreground">{formatDistanceToNow(new Date(n.at), { addSuffix: true })}</span>
                          </div>
                          <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
                        </div>
                        {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                      </li>
                    );
                  })}
                </ul>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}