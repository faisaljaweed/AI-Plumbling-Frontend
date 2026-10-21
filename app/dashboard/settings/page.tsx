"use client";

import { FormEvent, useEffect, useState } from "react";
import { Building2, Mail, Phone, MapPin, Save } from "lucide-react";

const API_URL = "/api/backend";

type Business = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
};

export default function SettingsPage() {
  const [form, setForm] = useState<Business>({
    id: 1,
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBusiness = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/businesses/1`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load business");
        }

        setForm(data.data);
      } catch (error) {
        console.error("Business load error:", error);

        setError(
          error instanceof Error ? error.message : "Failed to load business",
        );
      } finally {
        setLoading(false);
      }
    };

    loadBusiness();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(`${API_URL}/businesses/1`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save business");
      }

      setForm(data.data);
      setSuccess("Business profile updated successfully.");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to save business",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="px-6 py-8 lg:px-10">
        <div className="h-[520px] animate-pulse rounded-[30px] bg-slate-200" />
      </main>
    );
  }

  return (
    <main className="px-6 py-8 lg:px-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
          Business Configuration
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
          Settings
        </h1>

        <p className="mt-2 max-w-2xl text-slate-500">
          Manage the business information used across the customer experience
          and operations dashboard.
        </p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        {/* Business Preview */}
        <div className="h-fit rounded-[30px] bg-slate-950 p-7 text-white shadow-xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">
            <Building2 size={25} />
          </div>

          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Business Profile
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {form.name || "Business Name"}
          </h2>

          <div className="mt-7 space-y-4">
            <PreviewRow
              icon={<Mail size={17} />}
              value={form.email || "No email"}
            />

            <PreviewRow
              icon={<Phone size={17} />}
              value={form.phone || "No phone"}
            />

            <PreviewRow
              icon={<MapPin size={17} />}
              value={
                [form.address, form.city, form.state]
                  .filter(Boolean)
                  .join(", ") || "No address"
              }
            />
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">Demo Business ID</p>

            <p className="mt-1 font-semibold">#{form.id}</p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-sm"
        >
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-slate-950">
              Company Information
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              These details represent the plumbing company in the demo.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Business Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="RapidFlow Plumbing"
            />

            <Field
              label="Business Email"
              name="email"
              type="email"
              value={form.email || ""}
              onChange={handleChange}
              placeholder="hello@rapidflowplumbing.com"
            />

            <Field
              label="Phone"
              name="phone"
              value={form.phone || ""}
              onChange={handleChange}
              placeholder="+1 214 555 0123"
            />

            <Field
              label="Street Address"
              name="address"
              value={form.address || ""}
              onChange={handleChange}
              placeholder="1200 Main Street"
            />

            <Field
              label="City"
              name="city"
              value={form.city || ""}
              onChange={handleChange}
              placeholder="Dallas"
            />

            <Field
              label="State"
              name="state"
              value={form.state || ""}
              onChange={handleChange}
              placeholder="Texas"
            />
          </div>

          {error && (
            <div className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          )}

          <div className="mt-7 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />

              {saving ? "Saving..." : "Save Business Profile"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        id={name}
        type={name === "phone" ? "tel" : type}
        required={["name", "email", "phone"].includes(name)}
        maxLength={name === "email" ? 254 : name === "phone" ? 25 : 150}
        minLength={name === "name" ? 2 : undefined}
        pattern={name === "phone" ? "[+()0-9 .-]{1,25}" : undefined}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
      />
    </div>
  );
}

function PreviewRow({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-start gap-3 text-sm text-slate-300">
      <div className="mt-0.5 text-blue-300">{icon}</div>

      <span className="leading-6">{value}</span>
    </div>
  );
}

