import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Paperclip, Save, Send, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/app/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import type { User } from "@/lib/types";

export const Route = createFileRoute("/_app/tasks/new")({
  component: NewTaskPage,
});

function NewTaskPage() {
  const nav = useNavigate();
  const [files, setFiles] = useState<string[]>(["brief.pdf"]);
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    void api.getUsers().then(setUsers).catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Create new task" description="Define the task and assign it to a team member." />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Task created");
          nav({ to: "/tasks" });
        }}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Task title</Label>
                <Input id="title" placeholder="e.g. Design Q4 launch landing page" className="mt-1.5" required />
              </div>
              <div>
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" rows={6} placeholder="Add context, goals, and acceptance criteria..." className="mt-1.5" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <Label className="mb-3 block">Attachments</Label>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed py-10 text-center transition hover:border-primary/50 hover:bg-accent/30">
              <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
              <div className="text-sm font-medium">Drop files here or click to upload</div>
              <div className="text-xs text-muted-foreground">PDF, DOC, PNG, JPG up to 10MB</div>
              <input type="file" multiple className="hidden" onChange={(e) => {
                const f = Array.from(e.target.files ?? []).map((f) => f.name);
                setFiles((prev) => [...prev, ...f]);
              }} />
            </label>
            {files.length > 0 && (
              <ul className="mt-3 space-y-2">
                {files.map((f, i) => (
                  <li key={i} className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-sm">
                    <span className="flex items-center gap-2 truncate"><Paperclip className="h-4 w-4 text-muted-foreground" />{f}</span>
                    <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive">
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold">Details</h3>
            <div className="space-y-4">
              <div>
                <Label>Priority</Label>
                <Select defaultValue="medium">
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="due">Due date</Label>
                <Input id="due" type="date" className="mt-1.5" />
              </div>
              <div>
                <Label>Assign to</Label>
                <Select>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Choose a staff member" /></SelectTrigger>
                  <SelectContent>
                    {users.filter((u) => u.role === "staff").map((u) => (
                      <SelectItem key={u.id} value={u.id}>{u.name} · {u.department}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button type="submit" className="w-full"><Send className="mr-1.5 h-4 w-4" />Create task</Button>
            <Button type="button" variant="outline" className="w-full" onClick={() => toast("Draft saved")}>
              <Save className="mr-1.5 h-4 w-4" />Save as draft
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}