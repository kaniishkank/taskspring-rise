import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ListChecks,
  Plus,
  Timer,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, formatDistanceToNow, isBefore, isToday } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { StatusBadge, PriorityBadge } from "@/components/app/status-badge";
import { UserAvatar } from "@/components/app/user-avatar";
import { api } from "@/lib/api";
import type { Notification, Task, User } from "@/lib/types";

export const Route = createFileRoute("/_app/")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      let isStaff = false;
      try {
        const user = JSON.parse(window.sessionStorage.getItem("mgg_user") || "{}");
        if (user && user.role === "STAFF") {
          isStaff = true;
        }
      } catch {}
      if (isStaff) {
        throw redirect({ to: "/tasks" });
      }
    }
  },
  component: Dashboard,
});

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const user = JSON.parse(window.sessionStorage.getItem("mgg_user") || "{}");
      if (user && user.role === "STAFF") {
        navigate({ to: "/tasks", replace: true });
      }
    } catch {}
  }, [navigate]);

  useEffect(() => {
    async function load() {
      try {
        const [taskData, notificationData, userData, currentData] = await Promise.all([
          api.getTasks(),
          api.getNotifications(),
          api.getUsers(),
          api.getCurrentUser(),
        ]);
        setTasks(taskData);
        setNotifications(notificationData);
        setUsers(userData);
        setCurrentUser(currentData.user);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  const total = tasks.length;
  const active = tasks.filter((t) => ["assigned", "in_progress"].includes(t.status?.toLowerCase())).length;
  const pending = tasks.filter((t) => ["submitted", "under_review"].includes(t.status?.toLowerCase())).length;
  const overdue = tasks.filter(
    (t) => !["completed", "approved"].includes(t.status?.toLowerCase()) && isBefore(new Date(t.dueDate), new Date()),
  ).length;
  const completed = tasks.filter((t) => ["completed", "approved"].includes(t.status?.toLowerCase())).length;

  const statusData = [
    { name: "Assigned", value: tasks.filter((t) => t.status?.toLowerCase() === "assigned").length, color: "var(--muted-foreground)" },
    { name: "In Progress", value: tasks.filter((t) => t.status?.toLowerCase() === "in_progress").length, color: "var(--info)" },
    { name: "Review", value: pending, color: "var(--warning)" },
    { name: "Completed", value: completed, color: "var(--success)" },
    { name: "Rejected", value: tasks.filter((t) => t.status?.toLowerCase() === "rejected").length, color: "var(--destructive)" },
  ];

  const monthly = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const dataMap: Record<string, { month: string; completed: number; assigned: number }> = {};
    
    // Initialize past 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mLabel = months[d.getMonth()];
      dataMap[mLabel] = { month: mLabel, completed: 0, assigned: 0 };
    }

    tasks.forEach((t) => {
      const date = new Date(t.createdAt);
      const mLabel = months[date.getMonth()];
      if (dataMap[mLabel]) {
        dataMap[mLabel].assigned++;
        if (["completed", "approved"].includes(t.status)) {
          dataMap[mLabel].completed++;
        }
      }
    });

    return Object.values(dataMap);
  }, [tasks]);

  const team = useMemo(() => {
    const getName = (id: string) => users.find((u) => u.id === id)?.name ?? id;
    return users.slice(0, 5).map((user) => ({
      name: user.name.split(" ")[0],
      tasks: tasks.filter((task) => task.assignedTo === user.id).length,
      completed: tasks.filter((task) => task.assignedTo === user.id && ["completed", "approved"].includes(task.status)).length,
    }));
  }, [tasks, users]);

  if (typeof window !== "undefined") {
    try {
      const user = JSON.parse(window.sessionStorage.getItem("mgg_user") || "{}");
      if (user && user.role === "STAFF") {
        return null;
      }
    } catch {}
  }

  if (loading) {
    return <div className="rounded-xl border bg-card p-8 text-sm text-muted-foreground">Loading dashboard…</div>;
  }

  return (
    <div>
      <PageHeader
        title={currentUser?.role === "STAFF" ? "My dashboard" : "Manager dashboard"}
        description={currentUser?.role === "STAFF" ? `Overview of ${currentUser?.name ?? "your"}'s tasks and upcoming deadlines.` : "Overview of tasks across your team this week."}
        actions={
          currentUser?.role !== "STAFF" && (
            <Button asChild>
              <Link to="/tasks/new"><Plus className="mr-1.5 h-4 w-4" />New task</Link>
            </Button>
          )
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Total tasks" value={total} icon={ListChecks} tone="primary" />
        <StatCard label="Active" value={active} icon={Activity} tone="info" />
        <StatCard label="Pending review" value={pending} icon={Timer} tone="warning" />
        <StatCard label="Overdue" value={overdue} icon={AlertTriangle} tone="danger" />
        <StatCard label="Completed" value={completed} icon={CheckCircle2} tone="success" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Monthly completion</h3>
              <p className="text-xs text-muted-foreground">Tasks assigned vs completed</p>
            </div>
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--popover-foreground)",
                  }}
                />
                <Line type="monotone" dataKey="assigned" stroke="var(--muted-foreground)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="completed" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="text-base font-semibold">Status distribution</h3>
          <p className="text-xs text-muted-foreground">Current tasks by status</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {statusData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--popover-foreground)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5 text-xs">
            {statusData.map((d) => (
              <li key={d.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                  {d.name}
                </span>
                <span className="font-medium">{d.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {currentUser?.role !== "STAFF" ? (
          <>
            <div className="rounded-xl border bg-card p-5 shadow-sm lg:col-span-2">
              <h3 className="text-base font-semibold">Team performance</h3>
              <p className="text-xs text-muted-foreground">Assigned vs completed by team member</p>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={team}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--popover)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                      }}
                    />
                    <Bar dataKey="tasks" fill="var(--muted-foreground)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="completed" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <h3 className="text-base font-semibold">Recent activity</h3>
              <ul className="mt-4 space-y-4">
                {notifications
                  .filter((n) => currentUser?.role !== "STAFF" || n.userId === currentUser?.id)
                  .slice(0, 5)
                  .map((n) => (
                  <li key={n.id} className="flex gap-3">
                    <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/12 text-primary">
                      <Activity className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{n.title}</div>
                      <div className="line-clamp-2 text-xs text-muted-foreground">{n.message}</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">
                        {formatDistanceToNow(new Date(n.at), { addSuffix: true })}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="rounded-xl border bg-card p-5 shadow-sm lg:col-span-3">
            <h3 className="text-base font-semibold">Recent activity</h3>
            <ul className="mt-4 space-y-4">
              {notifications
                .filter((n) => currentUser?.role !== "STAFF" || n.userId === currentUser?.id)
                .slice(0, 5)
                .map((n) => (
                <li key={n.id} className="flex gap-3">
                  <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/12 text-primary">
                    <Activity className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{n.title}</div>
                    <div className="line-clamp-2 text-xs text-muted-foreground">{n.message}</div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      {formatDistanceToNow(new Date(n.at), { addSuffix: true })}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h3 className="text-base font-semibold">Upcoming deadlines</h3>
            <p className="text-xs text-muted-foreground">Tasks due in the next 7 days</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/tasks">View all</Link>
          </Button>
        </div>
        <ul className="divide-y">
          {tasks
            .filter((t) => !["completed", "approved"].includes(t.status))
            .filter((t) => currentUser?.role !== "STAFF" || t.assignedTo === currentUser?.id)
            .slice(0, 5)
            .map((t) => {
              const u = users.find((user) => user.id === t.assignedTo);
              const due = new Date(t.dueDate);
              const overdueTask = isBefore(due, new Date()) && !isToday(due);
              return (
                <li key={t.id}>
                  <Link to="/tasks/$id" params={{ id: t.id }} className="flex items-center gap-4 p-4 transition hover:bg-accent/40">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <Clock className={`h-4 w-4 ${overdueTask ? "text-destructive" : "text-muted-foreground"}`} />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{t.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {t.id} · Due {format(due, "MMM d")} {overdueTask && <span className="text-destructive">· overdue</span>}
                        </div>
                      </div>
                    </div>
                    <PriorityBadge priority={t.priority} />
                    <StatusBadge status={t.status} />
                    <div className="hidden items-center gap-2 md:flex">
                      <UserAvatar name={u?.name} avatar={u?.avatar} size={28} />
                      <span className="text-sm">{u?.name}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}