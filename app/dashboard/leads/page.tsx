"use client";

import { useEffect, useState } from "react";

const API_URL = "/api/backend";

type Lead = {
  id: number;
  customer_name: string;
  email: string;
  phone: string;
  zip_code: string;
  service_type: string;
  issue_description: string;
  urgency: string;
  status: string;
  preferred_date: string;
  preferred_time: string;
  created_at: string;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const loadLeads = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/leads`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load leads");
        }

        setLeads(data.data || []);
      } catch (error) {
        console.error("Lead load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLeads();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const keyword = search.toLowerCase();

    return (
      lead.customer_name?.toLowerCase().includes(keyword) ||
      lead.email?.toLowerCase().includes(keyword) ||
      lead.phone?.toLowerCase().includes(keyword) ||
      lead.service_type?.toLowerCase().includes(keyword) ||
      lead.status?.toLowerCase().includes(keyword)
    );
  });

  const updateStatus = async (status: string) => {
    if (!selectedLead) return;

    try {
      setUpdatingStatus(true);

      const response = await fetch(
        `${API_URL}/leads/${selectedLead.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      setSelectedLead(data.data);

      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === selectedLead.id
            ? {
                ...lead,
                status: data.data.status,
              }
            : lead,
        ),
      );
    } catch (error) {
      console.error("Status update error:", error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <main className="px-6 py-8 lg:px-10">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
            Lead Management
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            Customer Leads
          </h1>

          <p className="mt-2 text-slate-500">
            Track every customer request from enquiry to booking.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
          <p className="text-xs text-slate-400">Total Leads</p>

          <p className="text-2xl font-bold text-slate-950">{leads.length}</p>
        </div>
      </div>

      {/* Leads Table */}
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        {/* Search */}
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, email, phone, service or status..."
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
          />

          <div className="text-sm text-slate-500">
            {filteredLeads.length} records
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-6 py-4 font-medium">Customer</th>

                <th className="px-6 py-4 font-medium">Service</th>

                <th className="px-6 py-4 font-medium">Urgency</th>

                <th className="px-6 py-4 font-medium">Status</th>

                <th className="px-6 py-4 font-medium">Preferred Visit</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className="cursor-pointer border-t border-slate-100 transition hover:bg-blue-50/40"
                >
                  {/* Customer */}
                  <td className="px-6 py-5">
                    <p className="font-semibold text-slate-900">
                      {lead.customer_name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {lead.email || "No email"}
                    </p>

                    <p className="text-xs text-slate-400">
                      {lead.phone || "No phone"}
                    </p>
                  </td>

                  {/* Service */}
                  <td className="px-6 py-5 text-sm text-slate-600">
                    {lead.service_type || "Unclassified"}
                  </td>

                  {/* Urgency */}
                  <td className="px-6 py-5">
                    <UrgencyBadge urgency={lead.urgency} />
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    <StatusBadge status={lead.status} />
                  </td>

                  {/* Preferred Visit */}
                  <td className="px-6 py-5 text-sm text-slate-500">
                    <p>{lead.preferred_date || "Not selected"}</p>

                    <p className="mt-1 text-xs text-slate-400">
                      {lead.preferred_time || ""}
                    </p>
                  </td>
                </tr>
              ))}

              {!loading && filteredLeads.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center text-sm text-slate-500"
                  >
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Lead Detail Drawer */}
      {selectedLead && (
        <>
          {/* Background Overlay */}
          <div
            onClick={() => setSelectedLead(null)}
            className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[2px]"
          />

          {/* Drawer */}
          <aside className="fixed right-0 top-0 z-50 h-screen w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
            {/* Drawer Header */}
            <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 px-7 py-6 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                    Customer details
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-slate-950">
                    {selectedLead.customer_name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Customer enquiry details
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="space-y-7 p-7">
              {/* Status Hero */}
              <section className="rounded-[26px] bg-slate-950 p-6 text-white shadow-lg">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Current Status
                </p>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-2xl font-semibold capitalize">
                    {selectedLead.status || "new"}
                  </p>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      selectedLead.urgency === "high"
                        ? "bg-rose-500/20 text-rose-300"
                        : selectedLead.urgency === "medium"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-white/10 text-slate-300"
                    }`}
                  >
                    {selectedLead.urgency || "normal"} urgency
                  </span>
                </div>
              </section>

              {/* Customer Details */}
              <section>
                <SectionTitle title="Customer Information" />

                <div className="grid gap-3 sm:grid-cols-2">
                  <DetailCard
                    label="Email"
                    value={selectedLead.email || "Not provided"}
                  />

                  <DetailCard
                    label="Phone"
                    value={selectedLead.phone || "Not provided"}
                  />

                  <DetailCard
                    label="ZIP Code"
                    value={selectedLead.zip_code || "Not provided"}
                  />

                  <DetailCard
                    label="Service"
                    value={selectedLead.service_type || "Not classified"}
                  />
                </div>
              </section>

              {/* Issue */}
              <section>
                <SectionTitle title="Plumbing Issue" />

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm leading-6 text-slate-700">
                    {selectedLead.issue_description ||
                      "No issue description provided."}
                  </p>
                </div>
              </section>

              {/* Preferred Appointment */}
              <section>
                <SectionTitle title="Preferred Appointment" />

                <div className="grid gap-3 sm:grid-cols-2">
                  <DetailCard
                    label="Preferred Date"
                    value={selectedLead.preferred_date || "Not selected"}
                  />

                  <DetailCard
                    label="Preferred Time"
                    value={selectedLead.preferred_time || "Not selected"}
                  />
                </div>
              </section>

              {/* Created */}
              <section>
                <SectionTitle title="Lead Information" />

                <DetailCard
                  label="Created"
                  value={
                    selectedLead.created_at
                      ? new Date(selectedLead.created_at).toLocaleString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          },
                        )
                      : "Unknown"
                  }
                />
              </section>

              {/* Status Update */}
              <section>
                <SectionTitle title="Move Lead" />

                <p className="mb-4 text-sm text-slate-500">
                  Update where this customer currently sits in the lead
                  pipeline.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    "new",
                    "qualified",
                    "booked",
                    "completed",
                    "follow-up",
                    "lost",
                  ].map((status) => {
                    const isActive = selectedLead.status === status;

                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => updateStatus(status)}
                        disabled={updatingStatus || isActive}
                        className={`rounded-2xl border px-4 py-3 text-sm font-semibold capitalize transition ${
                          isActive
                            ? "border-blue-600 bg-blue-600 text-white shadow-md"
                            : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                        } disabled:cursor-not-allowed disabled:opacity-70`}
                      >
                        {updatingStatus && !isActive ? status : status}
                      </button>
                    );
                  })}
                </div>

                {updatingStatus && (
                  <p className="mt-3 text-xs text-slate-400">
                    Updating lead status...
                  </p>
                )}
              </section>
            </div>
          </aside>
        </>
      )}
    </main>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
      {title}
    </p>
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
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles}`}
    >
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
            : value === "lost"
              ? "bg-rose-50 text-rose-700"
              : "bg-slate-100 text-slate-600";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles}`}
    >
      {value}
    </span>
  );
}

