import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { ListChecks } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { PriorityBadge, StatusBadge } from "@/components/app/status-badge";
import { EmptyState } from "@/components/app/empty-state";
import { api } from "@/lib/api";
import type { Task, User } from "@/lib/types";

export const Route = createFileRoute("/_app/my-tasks")({
  component: MyTasks,
});

function MyTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [taskData, userData] = await Promise.all([
          api.getTasks(),
          api.getCurrentUser(),
        ]);
        setTasks(taskData);
        setCurrentUser(userData.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  if (loading) {
    return <div className="rounded-xl border bg-card p-8 text-sm text-muted-foreground">Loading tasks…</div>;
  }

  const mine = tasks.filter((t) => currentUser && t.assignedTo === currentUser.id);
  return (
    <div>
      <PageHeader title="My tasks" description="Tasks assigned to you across all projects." />
      {mine.length === 0 ? (
        <EmptyState icon={ListChecks} title="No tasks assigned" description="When tasks are assigned to you they will show up here." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mine.map((t) => (
            <Link
              key={t.id}
              to="/tasks/$id"
              params={{ id: t.id }}
              className="group rounded-xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono">{t.id}</span>
                <PriorityBadge priority={t.priority} />
              </div>
              <h3 className="mt-2 line-clamp-2 text-base font-semibold group-hover:text-primary">{t.title}</h3>
              <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{t.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <StatusBadge status={t.status} />
                <span className="text-xs text-muted-foreground">Due {format(new Date(t.dueDate), "MMM d")}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}