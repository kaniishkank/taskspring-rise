import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/page-header";
import { PriorityBadge } from "@/components/app/status-badge";
import { tasks } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/calendar")({
  component: CalendarPage,
});

const priorityDot: Record<string, string> = {
  low: "bg-muted-foreground",
  medium: "bg-info",
  high: "bg-warning",
  urgent: "bg-destructive",
};

function CalendarPage() {
  const [cursor, setCursor] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const start = startOfWeek(startOfMonth(cursor));
  const end = endOfWeek(endOfMonth(cursor));
  const days = eachDayOfInterval({ start, end });

  const tasksByDay = (d: Date) => tasks.filter((t) => isSameDay(new Date(t.dueDate), d));

  return (
    <div>
      <PageHeader
        title="Calendar"
        description="Task deadlines and upcoming work."
        actions={
          <div className="flex gap-1 rounded-md border bg-card p-1 text-xs">
            {(["month", "week", "day"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "rounded px-3 py-1 capitalize transition",
                  view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {v}
              </button>
            ))}
          </div>
        }
      />
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-base font-semibold">{format(cursor, "MMMM yyyy")}</h3>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={() => setCursor(subMonths(cursor, 1))}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => setCursor(new Date())}>Today</Button>
            <Button variant="outline" size="icon" onClick={() => setCursor(addMonths(cursor, 1))}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="grid grid-cols-7 border-b text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} className="py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((d) => {
            const inMonth = isSameMonth(d, cursor);
            const dayTasks = tasksByDay(d);
            const isToday = isSameDay(d, new Date());
            return (
              <div key={d.toISOString()} className={cn("min-h-28 border-b border-r p-2 text-xs", !inMonth && "bg-muted/20 text-muted-foreground")}>
                <div className={cn("mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium", isToday && "bg-primary text-primary-foreground")}>
                  {format(d, "d")}
                </div>
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((t) => (
                    <Link
                      key={t.id}
                      to="/tasks/$id"
                      params={{ id: t.id }}
                      className="flex items-center gap-1 truncate rounded-sm border bg-background px-1.5 py-1 hover:bg-accent"
                    >
                      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", priorityDot[t.priority])} />
                      <span className="truncate">{t.title}</span>
                    </Link>
                  ))}
                  {dayTasks.length > 3 && <div className="px-1 text-[10px] text-muted-foreground">+{dayTasks.length - 3} more</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold">Legend</h3>
        <div className="flex flex-wrap gap-4 text-xs">
          {(["low","medium","high","urgent"] as const).map((p) => (
            <div key={p} className="flex items-center gap-2">
              <span className={cn("h-2 w-2 rounded-full", priorityDot[p])} />
              <PriorityBadge priority={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}