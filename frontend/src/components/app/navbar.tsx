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
  X,
  Clock,
  Clock3,
} from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/lib/theme";
import { useClock } from "@/hooks/use-clock";
import { api } from "@/lib/api";
import type { Notification, User, Task } from "@/lib/types";
import { UserAvatar } from "@/components/app/user-avatar";
import { downloadBase64File, getBlobFromBase64, openMockFile, viewBase64File } from "@/lib/utils";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/**
 * Main application navigation bar.
 * Provides global search, notifications, theme toggle, and user profile dropdown.
 *
 * @param onOpenSidebar - Callback to open the mobile sidebar drawer
 * @param onToggleCollapse - Callback to toggle desktop sidebar collapse state
 * @param collapsed - Whether the desktop sidebar is currently collapsed
 */
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
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showClock, setShowClock] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("mgg_show_clock") !== "false";
    }
    return true;
  });
  
  const toggleClock = () => {
    setShowClock(prev => {
      const next = !prev;
      localStorage.setItem("mgg_show_clock", String(next));
      return next;
    });
  };
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    void Promise.all([
      api.getCurrentUser(),
      api.getNotifications(),
      api.getTasks(),
      api.getUsers()
    ]).then(([userData, notificationData, taskData, userDataList]) => {
      setCurrentUser(userData.user);
      setNotifications(notificationData);
      setTasks(taskData);
      setUsers(userDataList);
    }).catch(() => {});
  }, []);

  const matchingTasks = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return tasks.filter((t) =>
      t.title.toLowerCase().includes(query) ||
      t.id.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [tasks, searchQuery]);

  const matchingUsers = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return users.filter((u) =>
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      (u.department && u.department.toLowerCase().includes(query))
    ).slice(0, 5);
  }, [users, searchQuery]);

  const matchingFiles = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const list: { name: string; taskTitle: string; taskId: string }[] = [];
    tasks.forEach((t) => {
      if (t.attachments) {
        t.attachments.forEach((a: any) => {
          const aName = typeof a === 'object' && a !== null ? a.name : a;
          if (aName && typeof aName === 'string' && aName.toLowerCase().includes(query)) {
            list.push({ name: aName, taskTitle: t.title, taskId: t.id });
          }
        });
      }
      if (t.submissions) {
        t.submissions.forEach((s) => {
          if (s.files) {
            s.files.forEach((f: any) => {
              const fName = typeof f === 'object' && f !== null ? f.name : f;
              if (fName && typeof fName === 'string' && fName.toLowerCase().includes(query)) {
                list.push({ name: fName, taskTitle: t.title, taskId: t.id });
              }
            });
          }
        });
      }
    });
    return list.filter((f, idx, self) => self.findIndex((x) => x.name === f.name) === idx).slice(0, 5);
  }, [tasks, searchQuery]);
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
        <button 
          type="button"
          onClick={() => {
            if (searchQuery.trim().length > 0) {
              if (matchingTasks.length > 0 && matchingTasks[0].id) {
                void navigate({ to: "/tasks/$id", params: { id: matchingTasks[0].id } });
              } else if (matchingUsers.length > 0 && matchingUsers[0].id) {
                void navigate({ to: "/users", search: { highlightUserId: matchingUsers[0].id } });
              } else if (matchingFiles.length > 0 && matchingFiles[0].taskId) {
                void navigate({ to: "/tasks/$id", params: { id: matchingFiles[0].taskId } });
              } else {
                toast("No matching results found.");
              }
              setSearchQuery("");
              setSearchFocused(false);
              document.getElementById("global-search-input")?.blur();
            }
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground z-10 transition-colors"
          title="Search"
        >
          <Search className="h-4 w-4" />
        </button>
        <Input
          id="global-search-input"
          placeholder="Search tasks, people, files..."
          className="h-10 pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchQuery.trim().length > 0) {
              e.preventDefault();
              if (matchingTasks.length > 0 && matchingTasks[0].id) {
                void navigate({ to: "/tasks/$id", params: { id: matchingTasks[0].id } });
              } else if (matchingUsers.length > 0 && matchingUsers[0].id) {
                void navigate({ to: "/users", search: { highlightUserId: matchingUsers[0].id } });
              } else if (matchingFiles.length > 0 && matchingFiles[0].taskId) {
                void navigate({ to: "/tasks/$id", params: { id: matchingFiles[0].taskId } });
              } else {
                toast("No matching results found.");
              }
              setSearchQuery("");
              setSearchFocused(false);
              document.getElementById("global-search-input")?.blur();
            }
          }}
        />
        {searchFocused && searchQuery.trim().length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-[400px] overflow-y-auto rounded-lg border border-border bg-popover p-2 shadow-lg backdrop-blur">
            {matchingTasks.length === 0 && matchingUsers.length === 0 && matchingFiles.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                No matching results found for "{searchQuery}"
              </div>
            ) : (
              <div className="space-y-4 p-1">
                {matchingTasks.length > 0 && (
                  <div>
                    <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Tasks
                    </div>
                    <ul className="space-y-0.5">
                      {matchingTasks.map((t) => (
                        <li key={t.id}>
                          <Link
                            to="/tasks/$id"
                            params={{ id: t.id }}
                            className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent text-sm"
                          >
                            <span className="truncate font-medium text-foreground">{t.title}</span>
                            <span className="font-mono text-[10px] text-muted-foreground">{t.id}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {matchingUsers.length > 0 && (
                  <div>
                    <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      People
                    </div>
                    <ul className="space-y-0.5">
                      {matchingUsers.map((u) => (
                        <li key={u.id} className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{u.name}</span>
                            <span className="text-xs text-muted-foreground">({u.email})</span>
                          </div>
                          <span className="text-[10px] rounded bg-muted px-1.5 py-0.5 text-muted-foreground capitalize">
                            {u.role.replace("_", " ")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {matchingFiles.length > 0 && (
                  <div>
                    <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Files
                    </div>
                    <ul className="space-y-0.5">
                      {matchingFiles.map((f) => (
                        <li key={f.name}>
                          <button
                            type="button"
                            onClick={() => {
                              if (f.taskId) {
                                void navigate({ to: "/tasks/$id", params: { id: f.taskId } });
                              } else {
                                toast.error("Could not find the associated task.");
                              }
                              setSearchFocused(false);
                            }}
                            className="flex w-full items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent text-sm text-left"
                          >
                            <span className="truncate text-foreground hover:underline">{f.name}</span>
                            <span className="text-[10px] text-muted-foreground truncate max-w-[120px] ml-2">
                              Task: {f.taskTitle}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="ml-auto flex items-center gap-1">
        {showClock && (
          <div className="relative mr-2 hidden items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1 text-right md:flex">
            <div className="leading-tight">
              <div className="font-mono text-sm font-semibold tracking-wider text-foreground">
                {time}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {day} • {dateShort}
              </div>
            </div>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={toggleClock} aria-label={showClock ? "Hide Clock" : "Show Clock"} title={showClock ? "Hide Clock" : "Show Clock"} className="hidden md:flex">
          {showClock ? <Clock className="h-4 w-4" /> : <Clock3 className="h-4 w-4 text-muted-foreground" />}
        </Button>
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
                <li key={n.id} className="group relative flex gap-3 p-3 pr-10 hover:bg-accent/40">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-muted" : "bg-primary"}`} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{n.title}</div>
                    <div className="line-clamp-2 text-xs text-muted-foreground">{n.message}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      void api.deleteNotification(n.id).then(() => {
                        setNotifications((prev) => prev.filter((x) => x.id !== n.id));
                      });
                    }}
                    className="absolute right-2 top-3 rounded p-1 opacity-0 transition-opacity hover:bg-background group-hover:opacity-100"
                    title="Dismiss notification"
                  >
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-accent/60">
              <UserAvatar name={currentUser?.name} avatar={currentUser?.avatar} size={32} />
              <span className="hidden text-sm font-medium md:inline">{currentUser?.name?.split(" ")[0] ?? "User"}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="leading-tight">
              <div className="text-sm">{currentUser?.name ?? "Loading user"}</div>
              <div className="text-xs font-normal text-muted-foreground">{currentUser?.email ?? ""}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => void navigate({ to: "/settings" })}>
              <UserIcon className="mr-2 h-4 w-4" />Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => void navigate({ to: "/settings" })}>
              <SettingsIcon className="mr-2 h-4 w-4" />Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                try {
                  window.sessionStorage.removeItem("mgg_user");
                  window.sessionStorage.removeItem("mgg_deadline_alert_shown");
                } catch {}
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