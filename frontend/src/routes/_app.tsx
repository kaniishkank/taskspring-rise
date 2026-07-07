import { Outlet, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { isToday } from "date-fns";
import { AppSidebar } from "@/components/app/sidebar";
import { Navbar } from "@/components/app/navbar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { api, API_BASE } from "@/lib/api";
import { requestFirebaseNotificationPermission } from "@/lib/firebase";
import { toast } from "sonner";

export const Route = createFileRoute("/_app")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !window.sessionStorage.getItem("mgg_user")) {
      throw redirect({ to: "/login" });
    }
  },
  component: AppLayout,
});

function AppLayout() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.sessionStorage.getItem("mgg_user")) {
      navigate({ to: "/login", replace: true });
    } else {
      setIsAuth(true);
    }
  }, [navigate]);

  useEffect(() => {
    if (typeof window === "undefined" || !isAuth) return;
    const alertShown = window.sessionStorage.getItem("mgg_deadline_alert_shown");
    if (alertShown) return;

    const checkDeadlines = async () => {
      try {
        const [{ user }, tasks, users] = await Promise.all([
          api.getCurrentUser(),
          api.getTasks(),
          api.getUsers(),
        ]);
        if (!user) return;

        if (user.role === "MANAGER" || user.role === "OPERATION") {
          // Filter tasks due today and status is not completed/approved (pending)
          const pendingToday = tasks.filter(
            (t) => isToday(new Date(t.dueDate)) && !["completed", "approved"].includes(t.status)
          );

          pendingToday.forEach((t) => {
            const staffUser = users.find((u) => u.id === t.assignedToId);
            const staffName = staffUser ? staffUser.name : "Unknown Staff";
            toast.error(
              `⚠️ Pending Today: ${staffName} has '${t.title}' due by end of day.`,
              { duration: 8000 }
            );
          });
        } else {
          // Filter tasks assigned to current user which are not completed
          const myTasks = tasks.filter(
            (t) => t.assignedTo === user.id && !["completed", "approved"].includes(t.status)
          );

          const now = new Date();
          const overdue = myTasks.filter((t) => new Date(t.dueDate) < now);
          const approaching = myTasks.filter((t) => {
            const d = new Date(t.dueDate);
            return d >= now && d <= new Date(Date.now() + 48 * 60 * 60 * 1000);
          });

          if (overdue.length > 0 && approaching.length > 0) {
            toast.error(
              `Attention: You have ${overdue.length} overdue task(s) and ${approaching.length} task(s) due within 48 hours!`,
              { duration: 8000 }
            );
          } else if (overdue.length > 0) {
            toast.error(
              `Warning: You have ${overdue.length} overdue task(s)! Please review them.`,
              { duration: 8000 }
            );
          } else if (approaching.length > 0) {
            toast.warning(
              `Notice: You have ${approaching.length} task(s) due within the next 48 hours.`,
              { duration: 8000 }
            );
          }
        }

        window.sessionStorage.setItem("mgg_deadline_alert_shown", "true");
      } catch (err) {
        console.error("Deadline check failed", err);
      }
    };

    void checkDeadlines();
  }, [isAuth]);

  // ── SSE + Firebase push (runs independently of deadline check) ──────────
  useEffect(() => {
    if (typeof window === "undefined" || !isAuth) return;

    const userStr = window.sessionStorage.getItem("mgg_user");
    let sse: EventSource | null = null;

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user?.id) {
          const isSynced = localStorage.getItem(`mgg_cal_synced_${user.id}`);
          if (!isSynced) {
            localStorage.setItem(`mgg_cal_synced_${user.id}`, "true");
            const apiBaseUrl = typeof window !== "undefined"
              ? `${window.location.protocol}//${window.location.hostname}:4000`
              : "http://localhost:4000";
            const webcalUrl = `${apiBaseUrl.replace(/^http(s)?:/, "webcal:")}/api/tasks/ical/${user.id}`;
            console.log("[Calendar] Automatically triggering calendar sync link:", webcalUrl);
          }
        }
        if (user?.token) {
          console.log("[SSE] Initializing EventSource connection to backend...");
          sse = new EventSource(`${API_BASE}/notifications/stream?token=${user.token}`);

          sse.onopen = () => {
            console.log("[SSE] Connection successfully opened!");
          };

          sse.onerror = (error) => {
            console.error("[SSE] Connection error:", error);
          };

          sse.onmessage = (event) => {
            console.log("[SSE] Raw message received:", event.data);
            try {
              if (event.data === ":") return;
              const data = JSON.parse(event.data);
              console.log("[SSE] Parsed message data:", data);
              if (data.title && data.message) {
                toast(data.title, {
                  description: data.message,
                  duration: 8000,
                });
                window.dispatchEvent(new CustomEvent("mgg_notifications_updated"));

                if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
                  const taskTitle = data.task?.title || data.title;
                  new Notification("High Priority Task Alert", {
                    body: "Task: '" + taskTitle + "' requires immediate attention.",
                    icon: "/favicon.ico"
                  });
                }
              }
            } catch (err) {
              console.error("[SSE] Failed to parse SSE message", err, event.data);
            }
          };
        }
      } catch (err) {
        console.error("[SSE] Failed to initialize SSE completely", err);
      }
    }

    return () => {
      if (sse) sse.close();
    };
  }, [isAuth]);

  if (!isAuth) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <div className="hidden lg:flex">
        <AppSidebar collapsed={collapsed} />
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <AppSidebar onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          onOpenSidebar={() => setOpen(true)}
          onToggleCollapse={() => setCollapsed((v) => !v)}
          collapsed={collapsed}
        />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}