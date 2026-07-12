import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/page-header";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { Smartphone, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Route = createFileRoute("/_app/whatsapp")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      let isDevOps = false;
      try {
        const user = JSON.parse(window.sessionStorage.getItem("mgg_user") || "{}");
        if (user && user.email === "devops@mggschool.edu") {
          isDevOps = true;
        }
      } catch (e) {}

      if (!isDevOps) {
        throw redirect({ to: "/tasks" });
      }
    }
  },
  component: WhatsAppSetup,
});

function WhatsAppSetup() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<{ isReady: boolean; qrBase64: string | null } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Double-check authorization on mount
    try {
      const user = JSON.parse(window.sessionStorage.getItem("mgg_user") || "{}");
      if (!user || user.email !== "devops@mggschool.edu") {
        navigate({ to: "/tasks", replace: true });
        return;
      }
      setIsAuthorized(true);
    } catch (e) {
      navigate({ to: "/tasks", replace: true });
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (!isAuthorized) return;
    
    const fetchStatus = async () => {
      try {
        const res = await api.getWhatsAppStatus();
        setStatus(res);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch WhatsApp status");
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [isAuthorized]);

  if (!isAuthorized) return null;


  return (
    <div>
      <PageHeader
        title="WhatsApp Gateway Setup"
        description="Securely link the school's WhatsApp account for automated notifications."
      />

      <div className="mt-8 flex max-w-2xl flex-col items-center justify-center mx-auto space-y-8">
        <div className="w-full rounded-xl border bg-card p-10 text-center shadow-sm">
          {error && (
            <Alert variant="destructive" className="mb-6 text-left">
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!status ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground">Checking WhatsApp connection status...</p>
            </div>
          ) : status.isReady ? (
            <div className="flex flex-col items-center justify-center space-y-6 py-12">
              <div className="rounded-full bg-green-100 p-6 dark:bg-green-900/30">
                <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight">System Linked Successfully</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  TaskFlow is actively connected to WhatsApp. Automated notifications are flowing correctly.
                </p>
              </div>
            </div>
          ) : status.qrBase64 ? (
            <div className="flex flex-col items-center space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Action Required: Link Device</h3>
                <p className="text-sm text-muted-foreground">
                  Open WhatsApp on your phone, tap **Linked Devices**, and scan the code below.
                </p>
              </div>
              
              <div className="relative rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5">
                <img 
                  src={status.qrBase64} 
                  alt="WhatsApp QR Code" 
                  className="h-64 w-64 object-contain"
                />
              </div>
              
              <p className="text-xs text-muted-foreground animate-pulse">
                QR code refreshes automatically every 20 seconds.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <Smartphone className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Waiting for WhatsApp engine to generate QR code...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
