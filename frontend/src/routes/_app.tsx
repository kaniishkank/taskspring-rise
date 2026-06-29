import { Outlet, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app/sidebar";
import { Navbar } from "@/components/app/navbar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { api } from "@/lib/api";
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
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem("mgg_user")) {
      navigate({ to: "/login", replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const alertShown = window.sessionStorage.getItem("mgg_deadline_alert_shown");
    if (alertShown) return;

    const checkDeadlines = async () => {
      try {
        const [{ user }, tasks] = await Promise.all([
          api.getCurrentUser(),
          api.getTasks(),
        ]);
        if (!user) return;

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

        window.sessionStorage.setItem("mgg_deadline_alert_shown", "true");
      } catch (err) {
        console.error("Deadline check failed", err);
      }
    };

    void checkDeadlines();
  }, []);

  if (typeof window !== "undefined" && !window.localStorage.getItem("mgg_user")) {
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