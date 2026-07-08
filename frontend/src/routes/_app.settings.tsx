import { createFileRoute } from "@tanstack/react-router";
import { Bell, Lock, Palette, Save, User, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/app/page-header";
import { UserAvatar } from "@/components/app/user-avatar";
import { useTheme } from "@/lib/theme";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { User as UserType } from "@/lib/types";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, toggle } = useTheme();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  // Profile form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // Notification form state
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [notifyAssignments, setNotifyAssignments] = useState(true);
  const [notifyDeadlines, setNotifyDeadlines] = useState(true);
  const [notifyApprovals, setNotifyApprovals] = useState(true);
  const [notifyWeekly, setNotifyWeekly] = useState(true);

  // Security form state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingSecurity, setSavingSecurity] = useState(false);
  const [apiBaseUrl, setApiBaseUrl] = useState("http://localhost:4000");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setApiBaseUrl(`${window.location.protocol}//${window.location.hostname}:4000`);
    }
    void api
      .getCurrentUser()
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
          setName(data.user.name);
          setEmail(data.user.email);
          setDepartment(data.user.department || "");
          setPhoneNumber(data.user.phoneNumber || "");
          setAvatar(data.user.avatar || null);
          setNotifyWhatsApp(data.user.notifyWhatsApp ?? true);
          setNotifyAssignments(data.user.notifyAssignments ?? true);
          setNotifyDeadlines(data.user.notifyDeadlines ?? true);
          setNotifyApprovals(data.user.notifyApprovals ?? true);
          setNotifyWeekly(data.user.notifyWeekly ?? true);
        }
      })
      .catch(() => {});
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: keep base64 sizes small (e.g. under 1MB) for db storage
    if (file.size > 1024 * 1024) {
      toast.error("Avatar image must be under 1MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = async () => {
    if (!currentUser) return;
    try {
      const updatedUser = await api.updateUser(currentUser.id, {
        avatar: null,
      });
      setAvatar(null);
      setCurrentUser(updatedUser);
      window.sessionStorage.setItem("mgg_user", JSON.stringify(updatedUser));
      toast.success("Profile photo removed successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      toast.error(err.message || "Failed to remove profile photo");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setSavingProfile(true);
    try {
      const updatedUser = await api.updateUser(currentUser.id, {
        name,
        email,
        phoneNumber,
        department,
        avatar,
      });

      const oldUserStr = window.sessionStorage.getItem("mgg_user");
      let activeToken = "";
      if (oldUserStr) {
        try {
          activeToken = JSON.parse(oldUserStr).token || "";
        } catch {}
      }

      setCurrentUser(updatedUser);
      // Sync session storage so the sidebar, comments, and navigation fetch the updated user instantly
      window.sessionStorage.setItem("mgg_user", JSON.stringify({ ...updatedUser, token: activeToken }));
      
      toast.success("Profile details updated successfully!");
      // Reload page layout after brief timeout to refresh navbar/sidebar avatar/initials
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveNotifications = async () => {
    if (!currentUser) return;
    try {
      const updatedUser = await api.updateUser(currentUser.id, {
        notifyWhatsApp,
        notifyAssignments,
        notifyDeadlines,
        notifyApprovals,
        notifyWeekly,
      });

      const oldUserStr = window.sessionStorage.getItem("mgg_user");
      let activeToken = "";
      if (oldUserStr) {
        try {
          activeToken = JSON.parse(oldUserStr).token || "";
        } catch {}
      }

      setCurrentUser(updatedUser);
      window.sessionStorage.setItem("mgg_user", JSON.stringify({ ...updatedUser, token: activeToken }));
      toast.success("Notification preferences saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save notification preferences");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    setSavingSecurity(true);
    try {
      await api.updateUser(currentUser.id, {
        password: newPassword,
      });
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Security password updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setSavingSecurity(false);
    }
  };

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
          <form onSubmit={(e) => void handleSaveProfile(e)} className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative group">
                <UserAvatar name={currentUser?.name ?? "User"} avatar={avatar} size={80} className="border-2 border-primary/20" />
                <label className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110">
                  <Upload className="h-3.5 w-3.5" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
              <div>
                <h3 className="text-base font-semibold">{currentUser?.name ?? "Loading user"}</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {currentUser?.role?.replace("_", " ") ?? "user"} · {currentUser?.department ?? ""}
                </p>
                <div className="mt-2 text-xs text-muted-foreground">Accepts JPG, PNG formats under 1MB.</div>
                {avatar && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="mt-2 text-xs text-destructive hover:underline font-semibold text-left block font-medium"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="fullname">Full name</Label>
                <Input id="fullname" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="phone">WhatsApp Number (e.g. 14155552671)</Label>
                <Input id="phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="mt-1.5" placeholder="Include country code" />
              </div>
              <div>
                <Label htmlFor="dept">Department</Label>
                <Input id="dept" value={department} onChange={(e) => setDepartment(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={currentUser?.role?.replace("_", " ").toUpperCase() ?? ""} disabled className="mt-1.5 bg-muted/50 capitalize" />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={savingProfile}>
                <Save className="mr-1.5 h-4 w-4" />
                {savingProfile ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            {[
              { id: "whatsapp", label: "WhatsApp Direct Reminders", desc: "Get morning daily digests and instant alerts for high-priority tasks delivered straight to your WhatsApp inbox.", value: notifyWhatsApp, onChange: setNotifyWhatsApp },
              { id: "assignments", label: "Real-Time Push Alerts", desc: "Receive immediate on-screen desktop slider banners via Server-Sent Events (SSE) for instant task updates.", value: notifyAssignments, onChange: setNotifyAssignments },
              { id: "deadlines", label: "System OS Level Notifications", desc: "Enable native hardware-level operating system notification cards for critical high-priority task rules, active even when backgrounded.", value: notifyDeadlines, onChange: setNotifyDeadlines },
              { id: "approvals", label: "Automated Lifecyle Reminders", desc: "Trigger background worker cron notifications 24 hours prior to deadline targets and on the morning of due dates.", value: notifyApprovals, onChange: setNotifyApprovals },
              { id: "weekly", label: "External Calendar Stream Synchronization", desc: "Expose a dynamic cryptographic WebCal feed link to map workspace schedules natively into external personal device agendas.", value: notifyWeekly, onChange: setNotifyWeekly },
            ].map((row) => (
              <div key={row.id} className="flex items-center justify-between border-b py-4 last:border-0">
                <div>
                  <div className="text-sm font-medium">{row.label}</div>
                  <div className="text-xs text-muted-foreground">{row.desc}</div>
                </div>
                <Switch checked={row.value} onCheckedChange={row.onChange} />
              </div>
            ))}
            <div className="mt-6 flex justify-end">
              <Button type="button" onClick={() => void handleSaveNotifications()}>
                <Save className="mr-1.5 h-4 w-4" /> Save Preferences
              </Button>
            </div>


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
          <form onSubmit={(e) => void handleUpdatePassword(e)} className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={savingSecurity}>
                <Save className="mr-1.5 h-4 w-4" />
                {savingSecurity ? "Updating..." : "Update password"}
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}