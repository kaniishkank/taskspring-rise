import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, LogIn, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClock } from "@/hooks/use-clock";
import logoAsset from "@/assets/mgg-logo.svg.asset.json";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && window.sessionStorage.getItem("mgg_user")) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});


function LoginPage() {
  const navigate = useNavigate();
  const { time, dateLong, day } = useClock();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[Login] Form submitted! ID:", loginId);
    
    const cleanEmail = loginId.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      console.log("[Login] Empty ID, returning.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      console.log("[Login] Calling api.login...");
      const response = await api.login(cleanEmail, cleanPassword);
      console.log("[Login] Success! User:", response.user);
      window.sessionStorage.setItem("mgg_user", JSON.stringify({ ...response.user, token: response.token }));
      toast.success(`Welcome back, ${response.user.name}!`);
      if (response.user.role === "MANAGER" || response.user.role === "OPERATION") {
        console.log("[Login] Redirecting to /");
        navigate({ to: "/" });
      } else {
        console.log("[Login] Redirecting to /tasks");
        navigate({ to: "/tasks" });
      }
    } catch (err: any) {
      console.error("[Login Exception]", err);
      const errMsg = err.message || "Invalid credentials. Access Denied.";
      setError(errMsg.includes("check your email") ? errMsg : `${errMsg} Please check your email and password and try again.`);
      toast.error(errMsg);
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
              {error && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium rounded-md flex items-center gap-2 animate-shake">
                  ❌ {error}
                </div>
              )}
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

              <Button type="submit" className="w-full gap-2 font-medium" size="lg" disabled={loading}>
                <LogIn className="h-4 w-4" />
                {loading ? "Signing in…" : "Sign in"}
              </Button>

              {/* Demo Credentials Quick-Fill Section */}
              <div className="pt-4 border-t border-border/80">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    1-Click Demo Logins
                  </span>
                  <span className="text-[11px] text-muted-foreground">Click to fill</span>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginId("principal.ramanathan@mggschool.edu");
                      setPassword("Admin@2026");
                      setError("");
                      toast.info("Filled Principal (Manager) credentials");
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-secondary/40 hover:bg-secondary hover:border-primary/40 transition-all text-left group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                        🎓 Principal S. Ramanathan
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        principal.ramanathan@mggschool.edu • <span className="font-mono text-[10px] bg-muted px-1 py-0.5 rounded">MANAGER</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Use →
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginId("divya.cs@mggschool.edu");
                      setPassword("Admin@2026");
                      setError("");
                      toast.info("Filled Teacher (Staff) credentials");
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-secondary/40 hover:bg-secondary hover:border-primary/40 transition-all text-left group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                        👩‍🏫 S. Divya (CS Faculty)
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        divya.cs@mggschool.edu • <span className="font-mono text-[10px] bg-muted px-1 py-0.5 rounded">STAFF</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Use →
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginId("devops@mggschool.edu");
                      setPassword("DevOps@2026");
                      setError("");
                      toast.info("Filled DevOps Admin credentials");
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 bg-secondary/40 hover:bg-secondary hover:border-primary/40 transition-all text-left group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                        🛠️ System Administrator
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        devops@mggschool.edu • <span className="font-mono text-[10px] bg-muted px-1 py-0.5 rounded">DEVOPS / QR</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Use →
                    </span>
                  </button>
                </div>
                
                <p className="mt-3 text-center text-[11px] text-muted-foreground/80">
                  Default Password: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">Admin@2026</code> (DevOps: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">DevOps@2026</code>)
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}