import { cn } from "@/lib/utils";

export function UserAvatar({ name, size = 32, className }: { name?: string; size?: number; className?: string }) {
  const initials = (name ?? "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      className={cn("inline-grid place-items-center rounded-full bg-primary/15 font-semibold text-primary", className)}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {initials}
    </span>
  );
}