import {
  Bell,
  Menu,
  Moon,
  Search,
  Sun,
  LogOut,
  User as UserIcon,
  Settings as SettingsIcon,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/lib/theme";
import { useClock } from "@/hooks/use-clock";
import { api } from "@/lib/api";
import type { Notification, User } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function Navbar({
  onOpenSidebar,
  onToggleCollapse,
  collapsed,
}: {
  onOpenSidebar: () => void;
  onToggleCollapse?: () => void;
  collapsed?: boolean;
}) {
  const { theme, toggle } = useTheme();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  useEffect(() => {
    void Promise.all([api.getCurrentUser(), api.getNotifications()]).then(([userData, notificationData]) => {
      setCurrentUser(userData.user);
      setNotifications(notificationData);
    }).catch(() => {});
  }, []);
  const unread = notifications.filter((n) => !n.read).length;
  const { time, dateShort, day } = useClock();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenSidebar}>
        <Menu className="h-5 w-5" />
      </Button>
      {onToggleCollapse && (
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:inline-flex"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </Button>
      )}
      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search tasks, people, files..." className="h-10 pl-9" />
      </div>
      <div className="ml-auto flex items-center gap-1">
        <div className="mr-2 hidden items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-right md:flex">
          <div className="leading-tight">
            <div className="font-mono text-sm font-semibold tracking-wider text-foreground">
              {time}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {day} • {dateShort}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                  {unread}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b p-3">
              <div className="text-sm font-semibold">Notifications</div>
              <Link to="/notifications" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            <ul className="max-h-80 divide-y overflow-y-auto">
              {notifications.slice(0, 5).map((n) => (
                <li key={n.id} className="flex gap-3 p-3 hover:bg-accent/40">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-muted" : "bg-primary"}`} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{n.title}</div>
                    <div className="line-clamp-2 text-xs text-muted-foreground">{n.message}</div>
                  </div>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-accent/60">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                {currentUser?.name ? currentUser.name.split(" ").map((n) => n[0]).join("") : "U"}
              </span>
              <span className="hidden text-sm font-medium md:inline">{currentUser?.name?.split(" ")[0] ?? "User"}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="leading-tight">
              <div className="text-sm">{currentUser?.name ?? "Loading user"}</div>
              <div className="text-xs font-normal text-muted-foreground">{currentUser?.email ?? ""}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings"><UserIcon className="mr-2 h-4 w-4" />Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings"><SettingsIcon className="mr-2 h-4 w-4" />Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                try { window.localStorage.removeItem("mgg_user"); } catch {}
                window.location.href = "/login";
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}