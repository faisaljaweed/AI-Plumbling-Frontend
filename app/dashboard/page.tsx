"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
type Analytics = {
  totalLeads: number;
  qualifiedLeads: number;
  bookings: number;
  conversionRate: number;

};

type Lead = {
  id: number;
  customer_name: string;
  email?: string;
  phone?: string;
  service_type?: string;
  urgency?: string;
  status?: string;
  created_at: string;
};

const API_URL = "/api/backend";

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [analyticsRes, leadsRes] = await Promise.all([
          fetch(`${API_URL}/analytics?business_id=1`),
          fetch(`${API_URL}/leads`),
        ]);

        const analyticsData = await analyticsRes.json();
        const leadsData = await leadsRes.json();

        setAnalytics(analyticsData.data);
        setLeads(leadsData.data || []);
      } catch (error) {
        console.error("Dashboard load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const recentLeads = leads.slice(0, 6);

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <div className="mx-auto max-w-[1500px] px-6 py-8 lg:px-10">
        {/* Top Header */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-blue-600">
              RapidFlow Command Center
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight lg:text-4xl">
              Plumbing Operations Dashboard
            </h1>

            <p className="mt-2 text-slate-500">
              Leads, bookings and conversion performance in one
              place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Business
              </p>
              {/* <p className="text-sm font-semibold text-slate-800">
                RapidFlow Plumbing
              </p> */}
            </div>

            <Link
              href="/new-lead"
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
            >
              + New Lead
            </Link>
          </div>
        </div>

        {/* Hero Metrics */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total Leads"
            value={loading ? "—" : (analytics?.totalLeads ?? 0)}
            meta="All customer enquiries"
            accent="bg-blue-50 text-blue-700"
          />

          <MetricCard
            title="Qualified"
            value={loading ? "—" : (analytics?.qualifiedLeads ?? 0)}
            meta="Ready for booking"
            accent="bg-emerald-50 text-emerald-700"
          />

          <MetricCard
            title="Bookings"
            value={loading ? "—" : (analytics?.bookings ?? 0)}
            meta="Confirmed appointments"
            accent="bg-violet-50 text-violet-700"
          />

          <MetricCard
            title="Conversion"
            value={loading ? "—" : `${analytics?.conversionRate ?? 0}%`}
            meta="Lead → booking"
            accent="bg-amber-50 text-amber-700"
          />
        </section>

        {/* Main Grid */}
        <section className="mt-6 grid gap-6 xl:grid-cols-[1.55fr_0.85fr]">
          {/* Leads */}
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold">Recent Leads</h2>
                <p className="text-sm text-slate-500">
                  Latest enquiries entering the pipeline
                </p>
              </div>

              <Link
                href="/dashboard/leads"
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                View all
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/80">
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-6 py-4 font-medium">Customer</th>
                    <th className="px-6 py-4 font-medium">Service</th>
                    <th className="px-6 py-4 font-medium">Urgency</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Created</th>
                  </tr>
                </thead>

                <tbody>
                  {recentLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-t border-slate-100 transition hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {lead.customer_name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {lead.email || lead.phone || "No contact info"}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {lead.service_type || "Not classified"}
                      </td>

                      <td className="px-6 py-5">
                        <UrgencyBadge urgency={lead.urgency} />
                      </td>

                      <td className="px-6 py-5">
                        <StatusBadge status={lead.status} />
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-500">
                        {new Date(lead.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}

                  {!loading && recentLeads.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-sm text-slate-500"
                      >
                        No leads found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            {/* Pipeline */}
            <div className="rounded-[28px] bg-slate-950 p-6 text-white shadow-xl">
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Live Pipeline
                </p>
                <h3 className="mt-2 text-2xl font-semibold">Lead Journey</h3>
              </div>

              <div className="space-y-4">
                <PipelineItem
                  label="New enquiries"
                  value={analytics?.totalLeads ?? 0}
                />
                <PipelineItem
                  label="Qualified"
                  value={analytics?.qualifiedLeads ?? 0}
                />
                <PipelineItem
                  label="Bookings"
                  value={analytics?.bookings ?? 0}
                />
              </div>

              <div className="mt-6 rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-slate-300">Conversion efficiency</p>

                <div className="mt-3 flex items-end justify-between">
                  <p className="text-3xl font-bold">
                    {analytics?.conversionRate ?? 0}%
                  </p>
                  <p className="text-xs text-slate-400">leads converted</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <p className="mt-1 text-sm text-slate-500">
                Common business tasks
              </p>

              <div className="mt-5 grid gap-3">
                <QuickAction label="Review new leads" href="/dashboard/leads" />

                <QuickAction
                  label="Check bookings"
                  href="/dashboard/bookings"
                />

                <QuickAction
                  label="View analytics"
                  href="/dashboard/analytics"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  title,
  value,
  meta,
  accent,
}: {
  title: string;
  value: string | number;
  meta: string;
  accent: string;
}) {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div
        className={`inline-flex rounded-xl px-3 py-1 text-xs font-semibold ${accent}`}
      >
        {title}
      </div>

      <p className="mt-5 text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{meta}</p>
    </div>
  );
}

function UrgencyBadge({ urgency }: { urgency?: string }) {
  const value = urgency?.toLowerCase() || "normal";

  const styles =
    value === "high"
      ? "bg-rose-50 text-rose-700"
      : value === "medium"
        ? "bg-amber-50 text-amber-700"
        : "bg-slate-100 text-slate-600";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles}`}>
      {value}
    </span>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const value = status?.toLowerCase() || "new";

  const styles =
    value === "booked"
      ? "bg-violet-50 text-violet-700"
      : value === "qualified"
        ? "bg-emerald-50 text-emerald-700"
        : value === "follow-up"
          ? "bg-amber-50 text-amber-700"
          : value === "completed"
            ? "bg-blue-50 text-blue-700"
            : "bg-slate-100 text-slate-600";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles}`}
    >
      {value}
    </span>
  );
}

function PipelineItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}

function QuickAction({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
    >
      <span>{label}</span>
      <span>→</span>
    </Link>
  );
}


