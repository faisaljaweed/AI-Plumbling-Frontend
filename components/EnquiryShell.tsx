import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Droplets, MessageSquare, CalendarDays, ShieldCheck } from "lucide-react";

export default function EnquiryShell({ children, step = 1 }: { children: React.ReactNode; step?: number }) {
  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/dashboard" className="flex items-center gap-3"><span className="rounded-xl bg-blue-600 p-2.5 text-white"><Droplets size={23} /></span><span className="text-lg font-bold tracking-tight">RapidFlow<span className="block text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">Plumbing workspace</span></span></Link>
          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"><ArrowLeft size={16} /><span>Dashboard</span></Link>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-xs font-medium sm:gap-5">
          {["Customer details", "AI conversation", "Book a visit"].map((label, i) => <div key={label} className="flex items-center gap-3"><span className={`flex h-7 w-7 items-center justify-center rounded-full ${i + 1 <= step ? "bg-blue-600 text-white" : "border border-slate-200 bg-white text-slate-400"}`}>{i + 1 < step ? <Check size={14} /> : i + 1}</span><span className={i + 1 === step ? "text-slate-900" : "text-slate-400"}>{label}</span>{i < 2 && <ArrowRight size={14} className="ml-1 hidden text-slate-300 sm:block" />}</div>)}
        </div>
        <div className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <aside className="relative overflow-hidden rounded-3xl bg-[#0b1630] p-7 text-white sm:p-10">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[45px] border-blue-500/10" />
            <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">{step === 1 ? "A better start to every service" : "Your plumbing assistant"}</p>
            <h1 className="relative mt-4 text-3xl font-semibold leading-[1.15] tracking-tight lg:mt-6 lg:text-5xl">{step === 1 ? <>Great service starts with a <span className="text-blue-400">conversation.</span></> : <>Let’s get the <span className="text-blue-400">details right.</span></>}</h1>
            <p className="relative mt-5 text-sm leading-7 text-slate-300">{step === 1 ? "Add a new enquiry and let our AI assistant gather the details, understand the issue, and help find the right appointment." : "Share a little more about the issue. Our assistant will help qualify the request and guide you toward an available appointment."}</p>
            <div className="mt-10 hidden space-y-6 lg:block">{[{ icon: Check, title: "Tell us what’s happening", text: "A few details about the customer and issue." }, { icon: MessageSquare, title: "Work through the details", text: "Our AI assistant asks the right questions." }, { icon: CalendarDays, title: "Find a time that works", text: "Choose from available service appointments." }].map(({icon: Icon, title, text}, i) => <div key={title} className="flex gap-4"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${i + 1 === step ? "bg-blue-600" : "bg-white/5 text-slate-400"}`}><Icon size={18} /></span><div><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-slate-400">{text}</p></div></div>)}</div>
            <div className="mt-10 hidden items-center gap-2 border-t border-white/10 pt-5 text-xs text-slate-400 lg:flex"><ShieldCheck size={16} />Customer details stay in your workspace.</div>
          </aside>
          {children}
        </div>
      </div>
    </main>
  );
}

