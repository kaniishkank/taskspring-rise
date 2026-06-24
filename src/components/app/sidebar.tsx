import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ListChecks,
  CheckSquare,
  Inbox,
  Calendar,
  BarChart3,
  Bell,
  Users,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { currentUser } from "@/lib/mock/data";
import type { Role } from "@/lib/types";

type Item = { to: string; label: string; icon: typeof LayoutDashboard; roles: Role[] };

const items: Item[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, roles: ["super_admin", "manager", "staff"] },
  { to: "/tasks", label: "Tasks", icon: ListChecks, roles: ["super_admin", "manager"] },
  { to: "/my-tasks", label: "My Tasks", icon: CheckSquare, roles: ["super_admin", "manager", "staff"] },
  { to: "/submissions", label: "Submissions", icon: Inbox, roles: ["super_admin", "manager"] },
  { to: "/calendar", label: "Calendar", icon: Calendar, roles: ["super_admin", "manager", "staff"] },
  { to: "/reports", label: "Reports", icon: BarChart3, roles: ["super_admin", "manager"] },
  { to: "/notifications", label: "Notifications", icon: Bell, roles: ["super_admin", "manager", "staff"] },
  { to: "/users", label: "Users", icon: Users, roles: ["super_admin", "manager"] },
  { to: "/settings", label: "Settings", icon: Settings, roles: ["super_admin", "manager", "staff"] },
];

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const visible = items.filter((i) => i.roles.includes(currentUser.role));

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold">Taskflow</div>
          <div className="text-[11px] text-muted-foreground">Enterprise</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </div>
        <ul className="space-y-1">
          {visible.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? path === "/" : path.startsWith(to);
            return (
              <li key={to}>
                <Link
                  to={to}
                  onClick={onNavigate}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
                  <span className="truncate">{label}</span>
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-md bg-sidebar-accent/50 p-2">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
            {currentUser.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-medium">{currentUser.name}</div>
            <div className="truncate text-[11px] capitalize text-muted-foreground">
              {currentUser.role.replace("_", " ")}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}