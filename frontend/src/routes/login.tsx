import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClock } from "@/hooks/use-clock";
import logoAsset from "@/assets/mgg-logo.svg.asset.json";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});


function LoginPage() {
  const navigate = useNavigate();
  const { time, dateLong, day } = useClock();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId.trim()) return;
    setLoading(true);
    try {
      const response = await api.login(loginId, password);
      window.sessionStorage.setItem("mgg_user", JSON.stringify({ id: response.user.id, role: response.user.role, name: response.user.name, token: response.token }));
      toast.success(`Welcome back, ${response.user.name}!`);
      if (response.user.role === "manager" || response.user.role === "super_admin") {
        navigate({ to: "/" });
      } else {
        navigate({ to: "/tasks" });
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Invalid credentials. Access Denied.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">


      {/* Ambient decorative blobs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          {/* Prominent banner above card */}
          <div className="mb-6 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text font-mono text-4xl font-bold tracking-wider text-transparent md:text-5xl">
              {time}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{dateLong}</div>
          </div>

          <div className="rounded-2xl border border-border bg-card/90 p-6 shadow-2xl backdrop-blur-sm md:p-8">
            <div className="mb-6 flex flex-col items-center gap-3">
              <div className="h-20 w-20 rounded-full bg-muted border border-muted-foreground/25 shadow-md ring-2 ring-primary/20 shrink-0" />
              <div className="text-center">
                <h1 className="text-xl font-bold text-foreground">
                  Mahatma Global Gateway Demo
                </h1>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  School Management Portal
                </p>
              </div>
              {/* Subtle clock inside card */}
              <div className="font-mono text-xs text-muted-foreground">
                {time} • {day}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loginId">Login ID</Label>
                <Input
                  id="loginId"
                  type="text"
                  placeholder="e.g. principal@mgg.edu.in"
                  autoComplete="username"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPw ? "text" : "password"}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full gap-2" size="lg" disabled={loading}>
                <LogIn className="h-4 w-4" />
                {loading ? "Signing in…" : "Sign in"}
              </Button>


            </form>
          </div>
        </div>
      </div>
    </div>
  );
}