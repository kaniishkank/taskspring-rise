import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Clock, FileSpreadsheet, FileText, ListChecks } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_app/reports")({
  component: ReportsPage,
});

const trend = Array.from({ length: 12 }).map((_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  completed: 10 + Math.round(Math.sin(i / 2) * 6 + i * 1.4),
  overdue: 3 + Math.round(Math.cos(i / 3) * 2 + 1),
}));

const performance = [
  { name: "Priya", on_time: 18, late: 2 },
  { name: "Jordan", on_time: 21, late: 1 },
  { name: "Sam", on_time: 9, late: 4 },
  { name: "Noah", on_time: 14, late: 2 },
  { name: "Maya", on_time: 11, late: 1 },
];

function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="Reports"
        description="Trends and performance analytics."
        actions={
          <div className="flex flex-wrap gap-2">
            <Select defaultValue="30d">
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="ytd">Year to date</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline"><FileText className="mr-1.5 h-4 w-4" />PDF</Button>
            <Button variant="outline"><FileSpreadsheet className="mr-1.5 h-4 w-4" />Excel</Button>
            <Button variant="outline"><FileText className="mr-1.5 h-4 w-4" />CSV</Button>
          </div>
        }
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total tasks" value={148} icon={ListChecks} tone="primary" />
        <StatCard label="Completed" value={112} icon={CheckCircle2} tone="success" />
        <StatCard label="Pending" value={28} icon={Clock} tone="warning" />
        <StatCard label="Overdue" value={8} icon={AlertTriangle} tone="danger" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-sm lg:col-span-2">
          <h3 className="text-base font-semibold">Completion trend</h3>
          <p className="text-xs text-muted-foreground">Completed and overdue tasks per month</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
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
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
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
              <BarChart data={performance} layout="vertical">
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