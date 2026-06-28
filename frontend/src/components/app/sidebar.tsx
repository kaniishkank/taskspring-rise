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
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Role, User } from "@/lib/types";
import logoAsset from "@/assets/mgg-logo.svg.asset.json";
import { api } from "@/lib/api";
import { UserAvatar } from "@/components/app/user-avatar";

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

/**
 * Sidebar navigation component.
 * Items are conditionally rendered based on the `roles` array matching the current user's role.
 *
 * @param onNavigate - Optional callback fired when a nav item is clicked (useful for mobile drawers)
 * @param collapsed - Visual state determining if sidebar is fully expanded or just showing icons
 */
export function AppSidebar({
  onNavigate,
  collapsed = false,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  useEffect(() => {
    void api.getCurrentUser().then((data) => setCurrentUser(data.user)).catch(() => {});
  }, []);
  const visible = items.filter((i) => currentUser ? i.roles.includes(currentUser.role) : true);

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center gap-2 border-b border-sidebar-border",
          collapsed ? "justify-center px-2" : "px-5",
        )}
      >
        <img
          src={logoAsset.url}
          alt="Mahatma Global Gateway"
          className="h-9 w-9 shrink-0 rounded-full ring-1 ring-border"
        />
        {!collapsed && (
          <div className="leading-tight">
            <div className="text-sm font-semibold">Mahatma Global</div>
            <div className="text-[11px] text-muted-foreground">Gateway School</div>
          </div>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        {!collapsed && (
          <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Workspace
          </div>
        )}
        <ul className="space-y-1">
          {visible.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? path === "/" : path.startsWith(to);
            return (
              <li key={to}>
                <Link
                  to={to}
                  onClick={onNavigate}
                  title={collapsed ? label : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-md py-2 text-sm font-medium transition-colors",
                    collapsed ? "justify-center px-2" : "px-3",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
                  {!collapsed && <span className="truncate">{label}</span>}
                  {!collapsed && active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <div
          className={cn(
            "flex items-center rounded-md bg-sidebar-accent/50 p-2",
            collapsed ? "justify-center" : "gap-3",
          )}
        >
          <UserAvatar name={currentUser?.name} avatar={currentUser?.avatar} size={36} />
          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-medium">{currentUser?.name ?? "Loading user"}</div>
              <div className="truncate text-[11px] capitalize text-muted-foreground">
                {currentUser?.role?.replace("_", " ") ?? "user"}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}