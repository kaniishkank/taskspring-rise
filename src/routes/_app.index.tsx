import { createFileRoute, Link } from "@tanstack/react-router";
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
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { StatusBadge, PriorityBadge } from "@/components/app/status-badge";
import { UserAvatar } from "@/components/app/user-avatar";
import { tasks, userById, notifications } from "@/lib/mock/data";

export const Route = createFileRoute("/_app/")({
  component: Dashboard,
});

function Dashboard() {
  const total = tasks.length;
  const active = tasks.filter((t) => ["assigned", "in_progress"].includes(t.status)).length;
  const pending = tasks.filter((t) => ["submitted", "under_review"].includes(t.status)).length;
  const overdue = tasks.filter(
    (t) => !["completed", "approved"].includes(t.status) && isBefore(new Date(t.dueDate), new Date()),
  ).length;
  const completed = tasks.filter((t) => ["completed", "approved"].includes(t.status)).length;

  const statusData = [
    { name: "Assigned", value: tasks.filter((t) => t.status === "assigned").length, color: "var(--muted-foreground)" },
    { name: "In Progress", value: tasks.filter((t) => t.status === "in_progress").length, color: "var(--info)" },
    { name: "Review", value: pending, color: "var(--warning)" },
    { name: "Completed", value: completed, color: "var(--success)" },
    { name: "Rejected", value: tasks.filter((t) => t.status === "rejected").length, color: "var(--destructive)" },
  ];

  const monthly = [
    { month: "Apr", completed: 18, assigned: 24 },
    { month: "May", completed: 22, assigned: 26 },
    { month: "Jun", completed: 28, assigned: 31 },
    { month: "Jul", completed: 25, assigned: 30 },
    { month: "Aug", completed: 34, assigned: 38 },
    { month: "Sep", completed: 41, assigned: 44 },
    { month: "Oct", completed: 38, assigned: 42 },
  ];

  const team = [
    { name: "Priya", tasks: 12, completed: 10 },
    { name: "Jordan", tasks: 14, completed: 11 },
    { name: "Sam", tasks: 8, completed: 5 },
    { name: "Noah", tasks: 9, completed: 8 },
    { name: "Maya", tasks: 7, completed: 6 },
  ];

  return (
    <div>
      <PageHeader
        title="Manager dashboard"
        description="Overview of tasks across your team this week."
        actions={
          <Button asChild>
            <Link to="/tasks/new"><Plus className="mr-1.5 h-4 w-4" />New task</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Total tasks" value={total} icon={ListChecks} tone="primary" delta={{ value: "+12%", positive: true }} />
        <StatCard label="Active" value={active} icon={Activity} tone="info" delta={{ value: "+3", positive: true }} />
        <StatCard label="Pending review" value={pending} icon={Timer} tone="warning" />
        <StatCard label="Overdue" value={overdue} icon={AlertTriangle} tone="danger" delta={{ value: "-1", positive: true }} />
        <StatCard label="Completed" value={completed} icon={CheckCircle2} tone="success" delta={{ value: "+8%", positive: true }} />
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
            {notifications.slice(0, 5).map((n) => (
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
            .slice(0, 5)
            .map((t) => {
              const u = userById(t.assignedTo);
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
                      <UserAvatar name={u?.name} size={28} />
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