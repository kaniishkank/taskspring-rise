import { cn } from "@/lib/utils";
import type { Priority, TaskStatus } from "@/lib/types";

const statusStyles: Record<TaskStatus, string> = {
  assigned: "bg-muted text-foreground/80 border-border",
  in_progress: "bg-info/15 text-info border-info/30",
  submitted: "bg-primary/15 text-primary border-primary/30",
  under_review: "bg-warning/20 text-warning-foreground border-warning/40 dark:text-warning",
  approved: "bg-success/15 text-success border-success/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
  completed: "bg-success/20 text-success border-success/40",
  changes_requested: "bg-warning/15 text-warning border-warning/30 dark:text-warning",
  revision_pending: "bg-warning/25 text-warning border-warning/45 dark:text-warning",
};

const statusLabel: Record<TaskStatus, string> = {
  assigned: "Assigned",
  in_progress: "In Progress",
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  completed: "Completed",
  changes_requested: "Changes Requested",
  revision_pending: "Revision Pending",
};

export function StatusBadge({ status, className }: { status: TaskStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {statusLabel[status]}
    </span>
  );
}

const priorityStyles: Record<Priority, string> = {
  low: "bg-muted text-muted-foreground border-border",
  medium: "bg-info/15 text-info border-info/30",
  high: "bg-warning/20 text-warning-foreground dark:text-warning border-warning/40",
  urgent: "bg-destructive/15 text-destructive border-destructive/40",
};

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize",
        priorityStyles[priority],
        className,
      )}
    >
      {priority}
    </span>
  );
}