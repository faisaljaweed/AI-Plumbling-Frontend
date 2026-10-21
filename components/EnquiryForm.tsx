"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle, UserRound, LockKeyhole } from "lucide-react";
import { validateEnquiry } from "@/lib/validation";
import { createLead, ApiError } from "@/lib/api";

export default function EnquiryForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ customer_name: "", email: "", phone: "", zip_code: "", issue_description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors,setErrors]=useState<Record<string,string>>({});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation=validateEnquiry(formData);
    setErrors(validation);
    if(Object.keys(validation).length) return;
    try {
      setLoading(true);
      setError("");
      const response = await createLead({ business_id: 1, ...formData });
      router.push(`/chat?leadId=${response.data.id}`);
    } catch (error) {
      if(error instanceof ApiError) setErrors(error.errors);
      setError("Unable to submit your enquiry. Please try again.");
    } finally { setLoading(false); }
  };
  const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10";
  return (
    <form noValidate onSubmit={handleSubmit} className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_40px_-20px_#15264d30] sm:p-9">
      <div className="mb-7 flex items-center gap-3"><span className="rounded-xl bg-blue-50 p-3 text-blue-600"><UserRound size={22} /></span><div><h2 className="text-2xl font-semibold tracking-tight">New customer enquiry</h2><p className="mt-1 text-sm text-slate-500">Start with the essentials. We’ll take it from here.</p></div></div>
      <div className="grid gap-5 sm:grid-cols-2">
        {([{ name: "customer_name", label: "Full name", placeholder: "John Smith", type: "text", autoComplete: "name", required: true }, { name: "phone", label: "Phone number", placeholder: "+1 214 555 0101", type: "tel", autoComplete: "tel" }, { name: "email", label: "Email address", placeholder: "john@example.com", type: "email", autoComplete: "email" }, { name: "zip_code", label: "ZIP code", placeholder: "75201", type: "text", autoComplete: "postal-code" }] as const).map(field => <div key={field.name}><label htmlFor={field.name} className="mb-2 block text-sm font-medium text-slate-700">{field.label}{<span className="ml-1 text-blue-600">*</span>}</label><input name={field.name} type={field.type} autoComplete={field.autoComplete} placeholder={field.placeholder} id={field.name} required maxLength={field.name === "email" ? 254 : field.name === "phone" ? 25 : field.name === "zip_code" ? 10 : 100} inputMode={field.name === "zip_code" ? "numeric" : undefined} aria-invalid={Boolean(errors[field.name])} aria-describedby={errors[field.name] ? `${field.name}-error` : undefined} value={formData[field.name]} onChange={handleChange} className={`${inputClass} ${errors[field.name] ? "border-red-400" : ""}`} />{errors[field.name] && <p id={`${field.name}-error`} className="mt-1 text-xs text-red-600">{errors[field.name]}</p>}</div>)}
        <div className="sm:col-span-2"><label htmlFor="issue_description" className="mb-2 block text-sm font-medium text-slate-700">What’s happening? <span className="text-blue-600">*</span></label><textarea id="issue_description" name="issue_description" value={formData.issue_description} onChange={handleChange} required minLength={10} maxLength={2000} aria-invalid={Boolean(errors.issue_description)} aria-describedby="issue-error" rows={4} className={`${inputClass} min-h-32 resize-y`} placeholder="Tell us about the plumbing issue, where it is, and when it started…" />{errors.issue_description && <p id="issue-error" className="mt-1 text-xs text-red-600">{errors.issue_description}</p>}<p className="mt-2 text-xs text-slate-400">A little context helps us find the right solution.</p></div>
      </div>
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 disabled:cursor-wait disabled:opacity-60">{loading ? <LoaderCircle size={18} className="animate-spin" /> : null}{loading ? "Creating enquiry…" : "Continue to AI assistant"}{!loading && <ArrowRight size={17} />}</button>
      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400"><LockKeyhole size={13} />Customer details are saved with this enquiry.</p>
    </form>
  );
}

