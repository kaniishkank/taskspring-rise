import { createFileRoute } from "@tanstack/react-router";
import { Bell, Lock, Palette, Save, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/app/page-header";
import { UserAvatar } from "@/components/app/user-avatar";
import { currentUser } from "@/lib/mock/data";
import { useTheme } from "@/lib/theme";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, toggle } = useTheme();
  return (
    <div>
      <PageHeader title="Settings" description="Manage your account, preferences and notifications." />
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile"><User className="mr-1.5 h-4 w-4" />Profile</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-1.5 h-4 w-4" />Notifications</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="mr-1.5 h-4 w-4" />Appearance</TabsTrigger>
          <TabsTrigger value="security"><Lock className="mr-1.5 h-4 w-4" />Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <UserAvatar name={currentUser.name} size={64} />
              <div>
                <h3 className="text-base font-semibold">{currentUser.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{currentUser.role.replace("_", " ")} · {currentUser.department}</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div><Label>Full name</Label><Input defaultValue={currentUser.name} className="mt-1.5" /></div>
              <div><Label>Email</Label><Input defaultValue={currentUser.email} className="mt-1.5" /></div>
              <div><Label>Department</Label><Input defaultValue={currentUser.department} className="mt-1.5" /></div>
              <div><Label>Role</Label><Input defaultValue="Manager" disabled className="mt-1.5" /></div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => toast.success("Profile saved")}><Save className="mr-1.5 h-4 w-4" />Save changes</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            {[
              { label: "New task assignments", desc: "Email me when a task is assigned to me." },
              { label: "Deadline reminders", desc: "Reminders 24 hours before a task is due." },
              { label: "Submission approvals", desc: "Tell me when a submission is approved." },
              { label: "Weekly digest", desc: "A Monday morning summary of team activity." },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between border-b py-4 last:border-0">
                <div>
                  <div className="text-sm font-medium">{row.label}</div>
                  <div className="text-xs text-muted-foreground">{row.desc}</div>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="appearance">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Dark mode</div>
                <div className="text-xs text-muted-foreground">Currently using {theme} theme.</div>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={toggle} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div><Label>Current password</Label><Input type="password" className="mt-1.5" /></div>
              <div><Label>New password</Label><Input type="password" className="mt-1.5" /></div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => toast.success("Password updated")}><Save className="mr-1.5 h-4 w-4" />Update password</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}