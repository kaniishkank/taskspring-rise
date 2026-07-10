import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ListChecks } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_app/my-tasks")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      let isManagerOrAdmin = false;
      try {
        const user = JSON.parse(window.sessionStorage.getItem("mgg_user") || "{}");
        if (user && (user.role === "OPERATION" || user.role === "MANAGER")) {
          isManagerOrAdmin = true;
        }
      } catch {}
      if (isManagerOrAdmin) {
        throw redirect({ to: "/" });
      }
    }
  },
  component: MyTasks,
});

function MyTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [showSyncToast, setShowSyncToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tasks'); 
      
      if (res && res.data) {
        const allTasks = Array.isArray(res.data) ? res.data : (res.data.tasks || []);
        setTasks([...allTasks]);
      }
    } catch (err) {
      console.error("Sync error:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await api.getCurrentUser();
        setCurrentUser(userData.user);
      } catch {}
    };
    void loadUser();
    void fetchTasks();

    const syncInterval = setInterval(() => {
      void fetchTasks();
    }, 2500);

    const handleTasksUpdate = () => {
      void fetchTasks();
    };
    window.addEventListener("mgg_tasks_updated", handleTasksUpdate);
    return () => {
      clearInterval(syncInterval);
      window.removeEventListener("mgg_tasks_updated", handleTasksUpdate);
    };
  }, []);

  return (
    <div>
      <PageHeader 
        title="My tasks" 
        description="Tasks assigned to you across all projects." 
        actions={
          <Button
            variant="outline"
            onClick={async () => {
              try {
                console.log("Forcing manual network sync...");
                await fetchTasks();
                setShowSyncToast(true);
                setTimeout(() => setShowSyncToast(false), 1500);
              } catch (syncError) {
                console.error("Sync button network failure:", syncError);
                setTasks([]);
              }
            }}
            className="gap-1.5 font-semibold text-xs border-muted-foreground/20"
          >
            🔄 Sync Portals (1s)
          </Button>
        }
      />

      {loading && tasks.length === 0 ? (
        <div className="rounded-xl border bg-card p-8 text-sm text-muted-foreground">Loading tasks…</div>
      ) : tasks && tasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tasks.map((task: any) => (
            <Link
              key={task?.id || Math.random()}
              to="/tasks/$id"
              params={{ id: task?.id || "" }}
              className="group rounded-xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono">
                  {task?.id ? `TSK-${task.id.slice(-4).toUpperCase()}` : "TSK-TASK"}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  task?.priority === 'urgent' ? 'bg-destructive/10 text-destructive' :
                  task?.priority === 'high' ? 'bg-warning/10 text-warning-foreground' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {task?.priority || "medium"}
                </span>
              </div>
              <h3 className="mt-2 line-clamp-2 text-base font-semibold group-hover:text-primary">
                {task?.title || task?.name || "Untitled Task"}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                {task?.description || "No description provided."}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  task?.status === 'approved' || task?.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                  task?.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {task?.status || "PENDING"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Due {task?.dueDate || task?.deadline || "2026-07-16"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
          <ListChecks className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No tasks assigned</h3>
          <p className="mt-2 text-sm text-muted-foreground">When tasks are assigned to you they will show up here.</p>
        </div>
      )}

      {showSyncToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#10b981',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontWeight: 'bold',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease-in-out'
        }}>
          <span>✓</span> Sync Completed
        </div>
      )}
    </div>
  );
}