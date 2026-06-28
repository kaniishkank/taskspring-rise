import { cn } from "@/lib/utils";

export function UserAvatar({
  name,
  avatar,
  size = 32,
  className,
}: {
  name?: string;
  avatar?: string | null;
  size?: number;
  className?: string;
}) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name ?? "Avatar"}
        className={cn("rounded-full object-cover border border-border shrink-0", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className={cn("inline-block rounded-full bg-muted border border-muted-foreground/25 shrink-0", className)}
      style={{ width: size, height: size }}
    />
  );
}