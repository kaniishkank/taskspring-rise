import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck, CheckCircle2, Clock, MessageSquareWarning, UserPlus, Trash2, Paperclip, Download, Eye, Calendar, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/app/empty-state";
import { PriorityBadge, StatusBadge } from "@/components/app/status-badge";
import { UserAvatar } from "@/components/app/user-avatar";
import { downloadBase64File, viewBase64File, isPreviewable, cn } from "@/lib/utils";
import type { Notification, User } from "@/lib/types";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/notifications")({
  component: NotificationsPage,
});

const iconMap = {
  assignment: UserPlus,
  reminder: Clock,
  approval: CheckCircle2,
  rejection: MessageSquareWarning,
  update: Bell,
} as const;

const toneMap = {
  assignment: "bg-info/15 text-info",
  reminder: "bg-warning/20 text-warning-foreground dark:text-warning",
  approval: "bg-success/15 text-success",
  rejection: "bg-destructive/15 text-destructive",
  update: "bg-muted text-foreground",
} as const;

function NotificationsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Notification[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    void api.getCurrentUser().then((data) => setCurrentUser(data.user)).catch(() => {});
    void api.getNotifications().then(setItems).catch(() => {});
  }, []);

  const markAll = async () => {
    try {
      await api.markAllNotificationsRead();
      setItems((p) => p.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark notifications read");
    }
  };

  const mark = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setItems((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch {}
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await api.deleteNotification(id);
      setItems((p) => p.filter((n) => n.id !== id));
      if (expandedId === id) setExpandedId(null);
      toast.success("Notification deleted");
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  const toggleExpand = (n: Notification) => {
    if (!n.read) void mark(n.id);
    setExpandedId(prev => prev === n.id ? null : n.id);
  };

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
        actions={<Button variant="outline" onClick={() => void markAll()}><CheckCheck className="mr-1.5 h-4 w-4" />Mark all as read</Button>}
      />
      <Tabs defaultValue="all">
        <TabsList>
          {tabs.map((t) => <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>)}
        </TabsList>
        {tabs.map((t) => {
          const list = items
            .filter((n) => currentUser?.role !== "STAFF" || n.userId === currentUser?.id)
            .filter(t.filter);
          return (
            <TabsContent key={t.value} value={t.value}>
              {list.length === 0 ? (
                <EmptyState icon={Bell} title="You're all caught up" description="No notifications in this category." />
              ) : (
                <ul className="overflow-hidden rounded-xl border bg-card shadow-sm">
                  {list.map((n) => {
                    const Icon = iconMap[n.category] || Bell;
                    const isExpanded = expandedId === n.id;
                    const tone = toneMap[n.category] || toneMap.update;
                    
                    return (
                      <li
                        key={n.id}
                        className={cn(
                          "border-b transition last:border-0",
                          !n.read && "bg-primary/5",
                          isExpanded && "bg-muted/10"
                        )}
                      >
                        <div 
                          onClick={() => toggleExpand(n)}
                          className="group flex cursor-pointer items-start gap-4 p-4 hover:bg-accent/40"
                        >
                          <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full", tone)}>
                            <Icon className="h-5 w-5" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-3">
                              <h4 className="truncate text-sm font-semibold">{n.title}</h4>
                              <span className="shrink-0 text-xs text-muted-foreground" title={format(new Date(n.at), "PPpp")}>
                                {formatDistanceToNow(new Date(n.at), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                            <button
                              onClick={(e) => void handleDelete(e, n.id)}
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-destructive transition shrink-0"
                              title="Delete notification"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Expandable Details */}
                        {isExpanded && (
                          <div className="p-4 pt-0 pl-18 md:pl-18 lg:pl-18 ml-14 border-t">
                            {n.task ? (
                              <div className="rounded-lg border bg-background p-4 shadow-sm text-sm space-y-4 mt-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-base">{n.task.title}</span>
                                  <span className="text-muted-foreground font-mono text-xs ml-auto bg-muted px-2 py-0.5 rounded-full">{n.task.id}</span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Status & Priority</span>
                                    <div className="flex items-center gap-2 mt-1">
                                      <StatusBadge status={n.task.status} />
                                      <PriorityBadge priority={n.task.priority} />
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Dates</span>
                                    <div className="flex items-center gap-4 mt-1 text-xs">
                                      <div className="flex items-center gap-1.5" title="Due Date">
                                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className={new Date(n.task.dueDate) < new Date() && !['completed', 'approved'].includes(n.task.status) ? "text-destructive font-medium" : ""}>
                                          {format(new Date(n.task.dueDate), "MMM d, yyyy")}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1.5" title="Created Date">
                                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span>{format(new Date(n.task.createdAt), "MMM d, yyyy")}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Assigned By</span>
                                    <div className="flex items-center gap-2 mt-1">
                                      <UserAvatar user={n.task.assignedBy as User} className="h-5 w-5" />
                                      <span>{n.task.assignedBy?.name || "Unknown"}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Assigned To</span>
                                    <div className="flex items-center gap-2 mt-1">
                                      <UserAvatar user={n.task.assignedTo as User} className="h-5 w-5" />
                                      <span>{n.task.assignedTo?.name || "Unknown"}</span>
                                    </div>
                                  </div>
                                </div>

                                {n.task.description && (
                                  <div className="space-y-1 pt-2 border-t">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Description</span>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{n.task.description}</p>
                                  </div>
                                )}
                                
                                {n.task.attachments && n.task.attachments.length > 0 && (
                                  <div className="space-y-2 pt-2 border-t">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1">
                                      <Paperclip className="h-3 w-3" /> Attachments ({n.task.attachments.length})
                                    </span>
                                    <ul className="space-y-2">
                                      {n.task.attachments.map((a: any) => (
                                        <li key={a.name} className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-xs">
                                          <div className="flex items-center gap-2 truncate">
                                            <span className="font-medium truncate max-w-[150px]" title={a.name}>{a.name}</span>
                                            <span className="text-muted-foreground">{a.size}</span>
                                          </div>
                                          <div className="flex items-center gap-2 shrink-0">
                                            {isPreviewable(a.name, a.content) && (
                                              <Button variant="secondary" size="sm" className="h-6 px-2 text-[10px]" onClick={(e) => { e.stopPropagation(); viewBase64File(a.content || "", a.name); }}>
                                                <Eye className="h-3 w-3 mr-1" /> View
                                              </Button>
                                            )}
                                            <Button variant="outline" size="sm" className="h-6 px-2 text-[10px]" onClick={(e) => { e.stopPropagation(); downloadBase64File(a.content || "", a.name); }}>
                                              <Download className="h-3 w-3 mr-1" /> Download
                                            </Button>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground p-3 italic bg-muted/20 rounded-md border mt-4">
                                No additional task details available.
                              </div>
                            )}
                            
                            <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                              {n.task && (
                                <Button size="sm" onClick={() => void navigate({ to: `/tasks/${n.task!.id}` })}>Open Task</Button>
                              )}
                              {!n.read && (
                                <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); void mark(n.id); }}>Mark as Read</Button>
                              )}
                              <Button size="sm" variant="outline" onClick={() => setExpandedId(null)}>Close</Button>
                            </div>
                          </div>
                        )}
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