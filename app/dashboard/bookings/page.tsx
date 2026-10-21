"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Phone,
  Mail,
  Wrench,
  Search,
} from "lucide-react";

import { displayDate,displayTime } from "@/lib/dates";
const API_URL = "/api/backend";

type Booking = {
  id: number;
  business_id: number;
  lead_id: number;
  availability_slot_id: number | null;

  booking_date: string;
  booking_time: string;
  status: string;
  notes: string | null;

  created_at: string;
  updated_at: string;

  customer_name: string;
  email: string | null;
  phone: string | null;
  service_type: string | null;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/bookings`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load bookings");
        }

        setBookings(data.data || []);
      } catch (error) {
        console.error("Bookings load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return bookings;

    return bookings.filter((booking) => {
      return (
        booking.customer_name?.toLowerCase().includes(keyword) ||
        booking.email?.toLowerCase().includes(keyword) ||
        booking.phone?.toLowerCase().includes(keyword) ||
        booking.service_type?.toLowerCase().includes(keyword) ||
        booking.status?.toLowerCase().includes(keyword)
      );
    });
  }, [bookings, search]);

  const confirmedCount = bookings.filter(
    (item) => item.status === "confirmed",
  ).length;

  return (
    <main className="px-6 py-8 lg:px-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-600">
            Appointment Center
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            Bookings
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            View every confirmed plumbing appointment and customer booking
            detail in one place.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
            <p className="text-xs text-slate-400">Total Bookings</p>

            <p className="mt-1 text-2xl font-bold text-slate-950">
              {bookings.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
            <p className="text-xs text-slate-400">Confirmed</p>

            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {confirmedCount}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-md">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, service or status..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white"
          />
        </div>

        <p className="text-sm text-slate-500">
          {filteredBookings.length} appointments
        </p>
      </div>

      {/* Booking Cards */}
      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-[280px] animate-pulse rounded-[28px] bg-slate-200"
            />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
          <CalendarDays size={38} className="mx-auto text-slate-300" />

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No bookings found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Confirmed customer appointments will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </main>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const formattedDate = displayDate(booking.booking_date);

  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Top Date Section */}
      <div className="bg-slate-950 px-6 py-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Appointment #{booking.id}
            </p>

            <h2 className="mt-2 text-xl font-semibold">{formattedDate}</h2>
          </div>

          <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold capitalize text-emerald-300">
            {booking.status}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-2 text-sm text-slate-300">
          <Clock3 size={17} />
          <span>{displayTime(booking.booking_time)}</span>
        </div>
      </div>

      {/* Customer */}
      <div className="p-6">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Customer
          </p>

          <h3 className="mt-2 text-xl font-bold text-slate-950">
            {booking.customer_name}
          </h3>
        </div>

        <div className="space-y-3">
          <InfoRow
            icon={<Wrench size={16} />}
            label="Service"
            value={booking.service_type || "Not classified"}
          />

          <InfoRow
            icon={<Phone size={16} />}
            label="Phone"
            value={booking.phone || "Not provided"}
          />

          <InfoRow
            icon={<Mail size={16} />}
            label="Email"
            value={booking.email || "Not provided"}
          />
        </div>

        {booking.notes && (
          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Notes
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {booking.notes}
            </p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-400">Lead reference</p>

            <p className="mt-1 text-sm font-semibold text-slate-700">
              #{booking.lead_id}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <CalendarDays size={18} />
          </div>
        </div>
      </div>
    </article>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-semibold text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}

