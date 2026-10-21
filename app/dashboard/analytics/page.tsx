"use client";

import { useEffect, useState } from "react";
import {
  Users,
  CheckCircle2,
  CalendarCheck2,
  TrendingUp,

} from "lucide-react";

const API_URL = "/api/backend";

type Analytics = {
  totalLeads: number;
  qualifiedLeads: number;
  bookings: number;
  conversionRate: number;

};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/analytics?business_id=1`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load analytics");
        }

        setAnalytics(data.data);
      } catch (error) {
        console.error("Analytics load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const totalLeads = analytics?.totalLeads ?? 0;
  const qualifiedLeads = analytics?.qualifiedLeads ?? 0;
  const bookings = analytics?.bookings ?? 0;
  const conversionRate = analytics?.conversionRate ?? 0;

  const qualifiedPercent =
    totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;

  const bookedPercent =
    totalLeads > 0 ? Math.round((bookings / totalLeads) * 100) : 0;

  return (
    <main className="px-6 py-8 lg:px-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-600">
          Performance Intelligence
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
          Business Analytics
        </h1>

        <p className="mt-2 max-w-2xl text-slate-500">
          Understand how effectively customer enquiries are converting into
          qualified plumbing jobs.
        </p>
      </div>

      {/* KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<Users size={20} />}
          label="Total Leads"
          value={loading ? "—" : totalLeads}
          description="Customer enquiries"
          iconStyle="bg-blue-50 text-blue-600"
        />

        <MetricCard
          icon={<CheckCircle2 size={20} />}
          label="Qualified"
          value={loading ? "—" : qualifiedLeads}
          description="Ready to convert"
          iconStyle="bg-emerald-50 text-emerald-600"
        />

        <MetricCard
          icon={<CalendarCheck2 size={20} />}
          label="Bookings"
          value={loading ? "—" : bookings}
          description="Confirmed jobs"
          iconStyle="bg-violet-50 text-violet-600"
        />

        <MetricCard
          icon={<TrendingUp size={20} />}
          label="Conversion"
          value={loading ? "—" : `${conversionRate}%`}
          description="Lead to booking"
          iconStyle="bg-cyan-50 text-cyan-600"
        />
      </section>

      {/* Main Analytics */}
      <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Funnel */}
        <div className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-sm">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Conversion Funnel
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-950">
              Lead Journey
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              See how customer enquiries move toward booked jobs.
            </p>
          </div>

          <div className="space-y-6">
            <FunnelRow
              label="Total Leads"
              value={totalLeads}
              percent={100}
              barClass="bg-blue-500"
            />

            <FunnelRow
              label="Qualified Leads"
              value={qualifiedLeads}
              percent={qualifiedPercent}
              barClass="bg-emerald-500"
            />

            <FunnelRow
              label="Confirmed Bookings"
              value={bookings}
              percent={bookedPercent}
              barClass="bg-violet-500"
            />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-950 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                Conversion Efficiency
              </p>

              <p className="mt-3 text-4xl font-bold">{conversionRate}%</p>

              <p className="mt-2 text-sm text-slate-400">
                of enquiries became confirmed bookings
              </p>
            </div>
          </div>
        </div>

        {/* Insight Card */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[30px] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-7 text-white shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">
              AI Insight
            </p>

            <h2 className="mt-3 text-3xl font-bold leading-tight">
              Turn more enquiries into scheduled jobs.
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              Rapid responses, qualification and appointment selection help
              reduce the time between a customer enquiry and a confirmed
              plumbing visit.
            </p>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/10 p-5">
              <p className="text-sm text-slate-300">Current conversion</p>

              <div className="mt-2 flex items-end justify-between">
                <p className="text-4xl font-bold">{conversionRate}%</p>

                <TrendingUp className="text-blue-300" />
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Pipeline Snapshot
            </p>

            <div className="mt-5 space-y-4">
              <SnapshotRow label="New customer demand" value={totalLeads} />

              <SnapshotRow
                label="Qualified opportunities"
                value={qualifiedLeads}
              />

              <SnapshotRow
                label="Confirmed revenue opportunities"
                value={bookings}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
  description,
  iconStyle,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description: string;
  iconStyle: string;
}) {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconStyle}`}
      >
        {icon}
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>

      <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">{description}</p>
    </div>
  );
}

function FunnelRow({
  label,
  value,
  percent,
  barClass,
}: {
  label: string;
  value: number;
  percent: number;
  barClass: string;
}) {
  const safePercent = Math.max(0, Math.min(percent, 100));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">{label}</p>

          <p className="text-xs text-slate-400">{value} records</p>
        </div>

        <p className="text-sm font-bold text-slate-950">{safePercent}%</p>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${barClass}`}
          style={{
            width: `${safePercent}%`,
          }}
        />
      </div>
    </div>
  );
}

function SnapshotRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-600">{label}</span>

      <span className="text-lg font-bold text-slate-950">{value}</span>
    </div>
  );
}

