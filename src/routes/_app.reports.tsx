import { createFileRoute, redirect } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Clock, FileSpreadsheet, FileText, ListChecks } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState, useMemo } from "react";
import { format, subDays, subWeeks, isSameDay, startOfYear } from "date-fns";
import { api } from "@/lib/api";
import type { Task, User } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/reports")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      try {
        const user = JSON.parse(window.localStorage.getItem("mgg_user") || "{}");
        if (user && user.role === "staff") {
          throw redirect({ to: "/" });
        }
      } catch {}
    }
  },
  component: ReportsPage,
});

function ReportsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [period, setPeriod] = useState<string>("30d");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [taskData, userData] = await Promise.all([api.getTasks(), api.getUsers()]);
      setTasks(taskData);
      setUsers(userData);
    } catch {
      toast.error("Failed to load reports data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  // Filter tasks based on selected range
  const filteredTasks = useMemo(() => {
    const now = new Date();
    return tasks.filter((t) => {
      const created = new Date(t.createdAt);
      if (period === "7d") {
        return created >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      }
      if (period === "30d") {
        return created >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      }
      if (period === "90d") {
        return created >= new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      }
      if (period === "ytd") {
        return created >= startOfYear(now);
      }
      return true;
    });
  }, [tasks, period]);

  // Statistics
  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter((t) => ["completed", "approved"].includes(t.status)).length;
  const pendingTasks = filteredTasks.filter((t) => ["assigned", "in_progress", "submitted", "under_review", "rejected"].includes(t.status)).length;
  const overdueTasks = filteredTasks.filter((t) => {
    const isCompleted = ["completed", "approved"].includes(t.status);
    return !isCompleted && new Date(t.dueDate) < new Date();
  }).length;

  // Trend Data Calculation
  const trendData = useMemo(() => {
    if (period === "7d") {
      return Array.from({ length: 7 }).map((_, i) => {
        const d = subDays(new Date(), 6 - i);
        const dayLabel = format(d, "EEE");
        const dayTasks = filteredTasks.filter((t) => isSameDay(new Date(t.dueDate), d));
        const completed = dayTasks.filter((t) => ["completed", "approved"].includes(t.status)).length;
        const overdue = dayTasks.filter((t) => !["completed", "approved"].includes(t.status) && new Date(t.dueDate) < new Date()).length;
        return { name: dayLabel, completed, overdue };
      });
    }

    if (period === "30d") {
      return Array.from({ length: 30 }).map((_, i) => {
        const d = subDays(new Date(), 29 - i);
        const dayLabel = format(d, "d MMM");
        const dayTasks = filteredTasks.filter((t) => isSameDay(new Date(t.dueDate), d));
        const completed = dayTasks.filter((t) => ["completed", "approved"].includes(t.status)).length;
        const overdue = dayTasks.filter((t) => !["completed", "approved"].includes(t.status) && new Date(t.dueDate) < new Date()).length;
        return { name: dayLabel, completed, overdue };
      });
    }

    if (period === "90d") {
      return Array.from({ length: 12 }).map((_, i) => {
        const start = subWeeks(new Date(), 11 - i);
        const weekTasks = filteredTasks.filter((t) => {
          const d = new Date(t.dueDate);
          return d >= start && d <= subDays(start, -7);
        });
        const completed = weekTasks.filter((t) => ["completed", "approved"].includes(t.status)).length;
        const overdue = weekTasks.filter((t) => !["completed", "approved"].includes(t.status) && new Date(t.dueDate) < new Date()).length;
        return { name: `Wk ${12 - i}`, completed, overdue };
      });
    }

    // YTD
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const curMonth = new Date().getMonth();
    return Array.from({ length: curMonth + 1 }).map((_, i) => {
      const monthTasks = filteredTasks.filter((t) => {
        const d = new Date(t.dueDate);
        return d.getMonth() === i && d.getFullYear() === new Date().getFullYear();
      });
      const completed = monthTasks.filter((t) => ["completed", "approved"].includes(t.status)).length;
      const overdue = monthTasks.filter((t) => !["completed", "approved"].includes(t.status) && new Date(t.dueDate) < new Date()).length;
      return { name: months[i], completed, overdue };
    });
  }, [filteredTasks, period]);

  // Performance Data Calculation
  const performanceData = useMemo(() => {
    const staff = users.filter((u) => u.role === "staff");
    return staff.map((u) => {
      const userTasks = filteredTasks.filter((t) => t.assignedTo === u.id);
      let on_time = 0;
      let late = 0;

      userTasks.forEach((t) => {
        const isCompleted = ["completed", "approved"].includes(t.status);
        const dueDate = new Date(t.dueDate);
        if (isCompleted) {
          const latestSub = t.submissions?.find((s) => ["approved", "completed"].includes(s.status));
          const compDate = latestSub ? new Date(latestSub.at) : new Date(t.createdAt);
          if (compDate <= dueDate) {
            on_time++;
          } else {
            late++;
          }
        } else {
          if (dueDate < new Date()) {
            late++;
          } else {
            on_time++;
          }
        }
      });

      return {
        name: u.name.split(" ")[0],
        on_time,
        late,
      };
    });
  }, [filteredTasks, users]);

  // Export handlers
  const handleCSVExport = () => {
    const csvHeaders = ["Report Metric", "Value"];
    const csvRows = [
      ["Report Period", period],
      ["Total Tasks", totalTasks.toString()],
      ["Completed Tasks", completedTasks.toString()],
      ["Pending Tasks", pendingTasks.toString()],
      ["Overdue Tasks", overdueTasks.toString()],
      [],
      ["Staff Member Performance"],
      ["Name", "On Time Tasks", "Late/Overdue Tasks"]
    ];

    performanceData.forEach((p) => {
      csvRows.push([p.name, p.on_time.toString(), p.late.toString()]);
    });

    const csvContent = [csvHeaders.join(","), ...csvRows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mgg_report_${period}_${format(new Date(), "yyyyMMdd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Report exported successfully as CSV!");
  };

  const handleExcelExport = () => {
    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
      <!--[if gte mso 9]>
      <xml>
       <x:ExcelWorkbook>
        <x:ExcelWorksheets>
         <x:ExcelWorksheet>
          <x:Name>TaskFlow Report</x:Name>
          <x:WorksheetOptions>
           <x:DisplayGridlines/>
          </x:WorksheetOptions>
         </x:ExcelWorksheet>
        </x:ExcelWorksheets>
       </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table { border-collapse: collapse; }
        td, th { border: 1px solid #cbd5e1; padding: 8px; font-family: sans-serif; font-size: 12px; }
        th { background-color: #f1f5f9; font-weight: bold; }
        .header-row { font-size: 16px; font-weight: bold; background-color: #4f46e5; color: white; text-align: center; }
        .section-row { font-size: 14px; font-weight: bold; background-color: #e2e8f0; }
      </style>
      </head>
      <body>
      <table>
        <tr><th colspan="3" class="header-row">TaskFlow Report (Period: ${period.toUpperCase()})</th></tr>
        <tr><th>Metric</th><th colspan="2">Value</th></tr>
        <tr><td>Total Tasks</td><td colspan="2">${totalTasks}</td></tr>
        <tr><td>Completed Tasks</td><td colspan="2">${completedTasks}</td></tr>
        <tr><td>Pending Tasks</td><td colspan="2">${pendingTasks}</td></tr>
        <tr><td>Overdue Tasks</td><td colspan="2">${overdueTasks}</td></tr>
        <tr><td colspan="3"></td></tr>
        <tr><th colspan="3" class="section-row">Staff Member Performance</th></tr>
        <tr><th>Name</th><th>On Time Tasks</th><th>Late/Overdue Tasks</th></tr>
        ${performanceData.map((p) => `<tr><td>${p.name}</td><td>${p.on_time}</td><td>${p.late}</td></tr>`).join("")}
      </table>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mgg_report_${period}_${format(new Date(), "yyyyMMdd")}.xls`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Report exported successfully as Excel!");
  };

  const handlePDFExport = () => {
    window.print();
  };

  if (loading) {
    return <div className="rounded-xl border bg-card p-8 text-sm text-muted-foreground">Loading reports data…</div>;
  }

  return (
    <div>
      <style>{`
        @media print {
          aside, nav, header, button, .no-print, [role="combobox"], .flex-wrap {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
          }
          body {
            background: white !important;
          }
          .print-full-width {
            grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
            width: 100% !important;
          }
        }
      `}</style>
      
      <PageHeader
        title="Reports"
        description="Trends and performance analytics."
        actions={
          <div className="flex flex-wrap gap-2 no-print">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="ytd">Year to date</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handlePDFExport}><FileText className="mr-1.5 h-4 w-4" />PDF</Button>
            <Button variant="outline" onClick={handleExcelExport}><FileSpreadsheet className="mr-1.5 h-4 w-4" />Excel</Button>
            <Button variant="outline" onClick={handleCSVExport}><FileText className="mr-1.5 h-4 w-4" />CSV</Button>
          </div>
        }
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total tasks" value={totalTasks} icon={ListChecks} tone="primary" />
        <StatCard label="Completed" value={completedTasks} icon={CheckCircle2} tone="success" />
        <StatCard label="Pending" value={pendingTasks} icon={Clock} tone="warning" />
        <StatCard label="Overdue" value={overdueTasks} icon={AlertTriangle} tone="danger" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3 print-full-width">
        <div className="rounded-xl border bg-card p-5 shadow-sm lg:col-span-2">
          <h3 className="text-base font-semibold">Completion trend</h3>
          <p className="text-xs text-muted-foreground">Completed and overdue tasks per period</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--destructive)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--destructive)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="completed" stroke="var(--primary)" fill="url(#g1)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="overdue" stroke="var(--destructive)" fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="text-base font-semibold">Performance</h3>
          <p className="text-xs text-muted-foreground">On time vs late by member</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" fontSize={12} width={60} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="on_time" stackId="a" fill="var(--primary)" radius={[0, 4, 4, 0]} />
                <Bar dataKey="late" stackId="a" fill="var(--destructive)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}