import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

export function useClock() {
  const [now, setNow] = useState<Date>(() => new Date());
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const time = mounted ? `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}` : "--:--:--";
  const day = mounted ? now.toLocaleDateString(undefined, { weekday: "long" }) : "---";
  const dateLong = mounted ? now.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }) : "---";
  const dateShort = mounted ? now.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }) : "---";

  return { now, time, day, dateLong, dateShort };
}