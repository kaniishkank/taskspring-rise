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
import ExcelJS from "exceljs";
export const Route = createFileRoute("/_app/reports")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      let isStaff = false;
      try {
        const user = JSON.parse(window.sessionStorage.getItem("mgg_user") || "{}");
        if (user && user.role === "STAFF") {
          isStaff = true;
        }
      } catch {}
      if (isStaff) {
        throw redirect({ to: "/" });
      }
    }
  },
  component: ReportsPage,
});

function ReportsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [period, setPeriod] = useState<string>("30d");
  const [trendData, setTrendData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [taskData, userData, trend] = await Promise.all([
        api.getTasks(),
        api.getUsers(),
        api.getReportTrend(period)
      ]);
      setTasks(taskData);
      setUsers(userData);
      setTrendData(trend || []);
    } catch {
      toast.error("Failed to load reports data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [period]);

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
  // Performance Data Calculation
  const performanceData = useMemo(() => {
    const staff = users.filter((u) => u.role === "STAFF");
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

  const handleExcelExport = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('TaskFlow Report');

      // Configure columns
      sheet.columns = [
        { header: '', key: 'col1', width: 25 },
        { header: '', key: 'col2', width: 20 },
        { header: '', key: 'col3', width: 20 },
      ];

      // Main Header
      const titleRow = sheet.addRow([`TaskFlow Report (Period: ${period.toUpperCase()})`]);
      sheet.mergeCells('A1:C1');
      titleRow.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
      titleRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };
      titleRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

      // Subheader Metric
      const metricHeader = sheet.addRow(['Metric', 'Value', '']);
      sheet.mergeCells(`B${metricHeader.number}:C${metricHeader.number}`);
      metricHeader.font = { bold: true };
      metricHeader.getCell(1).border = { bottom: { style: 'thin' } };
      metricHeader.getCell(2).border = { bottom: { style: 'thin' } };

      // Metrics
      const m1 = sheet.addRow(['Total Tasks', totalTasks, '']);
      sheet.mergeCells(`B${m1.number}:C${m1.number}`);
      const m2 = sheet.addRow(['Completed Tasks', completedTasks, '']);
      sheet.mergeCells(`B${m2.number}:C${m2.number}`);
      const m3 = sheet.addRow(['Pending Tasks', pendingTasks, '']);
      sheet.mergeCells(`B${m3.number}:C${m3.number}`);
      const m4 = sheet.addRow(['Overdue Tasks', overdueTasks, '']);
      sheet.mergeCells(`B${m4.number}:C${m4.number}`);
      
      sheet.addRow([]);

      // Subheader Performance
      const perfTitle = sheet.addRow(['Staff Member Performance']);
      sheet.mergeCells(`A${perfTitle.number}:C${perfTitle.number}`);
      perfTitle.font = { bold: true, size: 12 };
      perfTitle.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
      perfTitle.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

      const perfHeader = sheet.addRow(['Name', 'On Time Tasks', 'Late/Overdue Tasks']);
      perfHeader.font = { bold: true };
      perfHeader.eachCell(cell => {
        cell.border = { bottom: { style: 'thin' } };
      });

      performanceData.forEach(p => {
        sheet.addRow([p.name, p.on_time, p.late]);
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `mgg_report_${period}_${format(new Date(), "yyyyMMdd")}.xlsx`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Report exported successfully as Excel!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate Excel file");
    }
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
          body, main {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .grid-cols-2 {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          }
          .print-full-width {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            gap: 16px !important;
          }
          .recharts-wrapper {
            max-height: 250px !important;
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