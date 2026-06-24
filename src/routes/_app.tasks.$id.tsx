import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { format, formatDistanceToNow } from "date-fns";
import { ArrowLeft, Calendar, CheckCircle2, MessageSquare, Paperclip, Send, User as UserIcon, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/app/page-header";
import { PriorityBadge, StatusBadge } from "@/components/app/status-badge";
import { UserAvatar } from "@/components/app/user-avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tasks, userById } from "@/lib/mock/data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/tasks/$id")({
  loader: ({ params }) => {
    const task = tasks.find((t) => t.id === params.id);
    if (!task) throw notFound();
    return { task };
  },
  notFoundComponent: () => (
    <div className="grid place-items-center py-20 text-center">
      <div>
        <h2 className="text-xl font-semibold">Task not found</h2>
        <Button asChild className="mt-4"><Link to="/tasks">Back to tasks</Link></Button>
      </div>
    </div>
  ),
  component: TaskDetail,
});

function TaskDetail() {
  const { task } = Route.useLoaderData();
  const assignee = userById(task.assignedTo);
  const assigner = userById(task.assignedBy);

  return (
    <div>
      <Link to="/tasks" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to tasks
      </Link>
      <PageHeader
        title={task.title}
        description={`${task.id} · Created ${format(new Date(task.createdAt), "MMM d, yyyy")}`}
        actions={
          <>
            <Button variant="outline"><XCircle className="mr-1.5 h-4 w-4" />Reject</Button>
            <Button><CheckCircle2 className="mr-1.5 h-4 w-4" />Approve</Button>
          </>
        }
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{task.description}</p>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
              <TabsTrigger value="activity">Activity log</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold">Attachments</h3>
                {task.attachments.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No attachments</div>
                ) : (
                  <ul className="space-y-2">
                    {task.attachments.map((a) => (
                      <li key={a.name} className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-sm">
                        <span className="flex items-center gap-2"><Paperclip className="h-4 w-4 text-muted-foreground" />{a.name}</span>
                        <span className="text-xs text-muted-foreground">{a.size}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold flex items-center gap-2"><MessageSquare className="h-4 w-4" />Comments</h3>
                {task.comments.length > 0 ? (
                  <ul className="space-y-4">
                    {task.comments.map((c) => {
                      const u = userById(c.userId);
                      return (
                        <li key={c.id} className="flex gap-3">
                          <UserAvatar name={u?.name} size={32} />
                          <div className="min-w-0 flex-1 rounded-lg border bg-muted/30 p-3">
                            <div className="flex items-baseline justify-between gap-2">
                              <span className="text-sm font-medium">{u?.name}</span>
                              <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(c.at), { addSuffix: true })}</span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="text-sm text-muted-foreground">No comments yet</div>
                )}
                <form
                  onSubmit={(e) => { e.preventDefault(); toast.success("Comment added"); (e.target as HTMLFormElement).reset(); }}
                  className="mt-4 flex flex-col gap-2"
                >
                  <Textarea placeholder="Write a comment..." rows={3} />
                  <div className="flex justify-end">
                    <Button size="sm" type="submit"><Send className="mr-1.5 h-3.5 w-3.5" />Comment</Button>
                  </div>
                </form>
              </div>
            </TabsContent>
            <TabsContent value="submissions">
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                {task.submissions.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No submissions yet.</div>
                ) : (
                  <ul className="space-y-4">
                    {task.submissions.map((s) => (
                      <li key={s.id} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <StatusBadge status={s.status} />
                          <span className="text-xs text-muted-foreground">{format(new Date(s.at), "MMM d, yyyy · HH:mm")}</span>
                        </div>
                        <p className="mt-3 text-sm">{s.notes}</p>
                        {s.files.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {s.files.map((f) => (
                              <span key={f} className="inline-flex items-center gap-1 rounded-md border bg-muted/40 px-2 py-1 text-xs">
                                <Paperclip className="h-3 w-3" />{f}
                              </span>
                            ))}
                          </div>
                        )}
                        {s.links.length > 0 && (
                          <ul className="mt-2 space-y-1 text-xs text-primary">
                            {s.links.map((l) => <li key={l}><a href={l} className="hover:underline">{l}</a></li>)}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </TabsContent>
            <TabsContent value="activity">
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <ol className="relative space-y-5 border-l pl-5">
                  <li>
                    <span className="absolute -left-1.5 h-3 w-3 rounded-full bg-primary" />
                    <div className="text-sm font-medium">Task created</div>
                    <div className="text-xs text-muted-foreground">{format(new Date(task.createdAt), "MMM d, yyyy · HH:mm")}</div>
                  </li>
                  <li>
                    <span className="absolute -left-1.5 h-3 w-3 rounded-full bg-info" />
                    <div className="text-sm font-medium">Assigned to {assignee?.name}</div>
                    <div className="text-xs text-muted-foreground">by {assigner?.name}</div>
                  </li>
                  {task.submissions.map((s) => (
                    <li key={s.id}>
                      <span className="absolute -left-1.5 h-3 w-3 rounded-full bg-warning" />
                      <div className="text-sm font-medium">Submission {s.status.replace("_", " ")}</div>
                      <div className="text-xs text-muted-foreground">{format(new Date(s.at), "MMM d, yyyy · HH:mm")}</div>
                    </li>
                  ))}
                </ol>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold">Details</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground flex items-center gap-2"><UserIcon className="h-4 w-4" />Assignee</dt>
                <dd className="flex items-center gap-2"><UserAvatar name={assignee?.name} size={24} />{assignee?.name}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground flex items-center gap-2"><UserIcon className="h-4 w-4" />Assigned by</dt>
                <dd>{assigner?.name}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" />Due date</dt>
                <dd>{format(new Date(task.dueDate), "MMM d, yyyy")}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Priority</dt>
                <dd><PriorityBadge priority={task.priority} /></dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd><StatusBadge status={task.status} /></dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}