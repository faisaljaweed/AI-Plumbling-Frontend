"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
} from "lucide-react";

import { displayDate,displayTime,businessToday } from "@/lib/dates";
const API_URL = "/api/backend";

type Slot = {
  id: number;
  business_id: number;
  slot_date: string;
  slot_time: string;
  is_available: boolean;
  created_at: string;
};

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    slot_date: "",
    slot_time: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSlots = async () => {
    try {


      const response = await fetch(`${API_URL}/availability?business_id=1&workspace=1`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load availability");
      }

      setSlots(data.data || []);
    } catch (error) {
      console.error("Availability load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(loadSlots);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.slot_date || !form.slot_time) {
      setError("Please select both date and time.");
      return;
    }

    try {
      setCreating(true);
      setError("");
      setSuccess("");

      const response = await fetch(`${API_URL}/availability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business_id: 1,
          slot_date: form.slot_date,
          slot_time: form.slot_time,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create slot");
      }

      setSlots((prev) => [...prev, data.data]);

      setForm({
        slot_date: "",
        slot_time: "",
      });

      setSuccess("New availability slot added.");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create slot",
      );
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      const response = await fetch(`${API_URL}/availability/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete slot");
      }

      setSlots((prev) => prev.filter((slot) => slot.id !== id));

      setSuccess("Availability slot deleted.");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete slot",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredSlots = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return slots;

    return slots.filter((slot) => {
      return (
        slot.slot_date.toLowerCase().includes(keyword) ||
        slot.slot_time.toLowerCase().includes(keyword)
      );
    });
  }, [slots, search]);

  const availableCount = slots.filter((slot) => slot.is_available).length;

  const unavailableCount = slots.filter((slot) => !slot.is_available).length;

  return (
    <main className="px-6 py-8 lg:px-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">
            Scheduling Workspace
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            Availability
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            Control which appointment times customers can book.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <SummaryCard label="Available" value={availableCount} success />

          <SummaryCard label="Booked" value={unavailableCount} />
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        {/* Create Slot */}
        <div className="h-fit rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Plus size={21} />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-slate-950">
            Add Appointment Slot
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Add a date and time that customers can select during the booking
            flow.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Date
              </label>

              <input
                type="date" required min={businessToday()}
                value={form.slot_date}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    slot_date: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Time
              </label>

              <input
                type="time" required
                value={form.slot_time}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    slot_time: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white"
              />
            </div>

            {error && (
              <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={creating}
              className="w-full rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? "Adding slot..." : "Add Availability"}
            </button>
          </form>
        </div>

        {/* Existing Slots */}
        <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Appointment Slots
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Available and already-booked appointment times.
              </p>
            </div>

            <div className="relative w-full md:max-w-xs">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search slots..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </div>
          ) : filteredSlots.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <CalendarClock size={40} className="mx-auto text-slate-300" />

              <h3 className="mt-4 font-semibold text-slate-900">
                No appointment slots
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Add your first available appointment time.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredSlots.map((slot) => (
                <SlotRow
                  key={slot.id}
                  slot={slot}
                  deleting={deletingId === slot.id}
                  onDelete={() => handleDelete(slot.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function SlotRow({
  slot,
  deleting,
  onDelete,
}: {
  slot: Slot;
  deleting: boolean;
  onDelete: () => void;
}) {
  const date = displayDate(slot.slot_date);

  return (
    <div className="flex flex-col gap-4 px-5 py-5 transition hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
            slot.is_available
              ? "bg-emerald-50 text-emerald-600"
              : "bg-rose-50 text-rose-600"
          }`}
        >
          {slot.is_available ? (
            <CheckCircle2 size={21} />
          ) : (
            <XCircle size={21} />
          )}
        </div>

        <div>
          <p className="font-semibold text-slate-900">{date}</p>

          <p className="mt-1 text-sm text-slate-500">{displayTime(slot.slot_time)}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            slot.is_available
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {slot.is_available ? "Available" : "Booked"}
        </span>

        {slot.is_available && (
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
          >
            <Trash2 size={17} />
          </button>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  success = false,
}: {
  label: string;
  value: number;
  success?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
      <p className="text-xs text-slate-400">{label}</p>

      <p
        className={`mt-1 text-2xl font-bold ${
          success ? "text-emerald-600" : "text-rose-600"
        }`}
      >
        {value}
      </p>
    </div>
  );
}


