import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  CalendarDays,

  BarChart3,
  Settings,
  Droplets,
  CalendarClock,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <aside className="fixed left-0 top-0 hidden h-screen w-[260px] border-r border-slate-800 bg-[#0b1120] px-5 py-6 text-white lg:block">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600">
            <Droplets size={22} />
          </div>

          <div>
            <h2 className="font-bold">RapidFlow</h2>
            {/* <p className="text-xs text-slate-400">AI Plumbing CRM</p> */}
          </div>
        </div>

        <p className="mb-3 mt-10 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Workspace
        </p>

        <nav className="space-y-2">
          <SidebarLink
            href="/dashboard"
            icon={<LayoutDashboard size={18} />}
            label="Overview"
          />

          <SidebarLink
            href="/dashboard/leads"
            icon={<Users size={18} />}
            label="Leads"
          />

          <SidebarLink
            href="/dashboard/bookings"
            icon={<CalendarDays size={18} />}
            label="Bookings"
          />
          <SidebarLink
            href="/dashboard/availability"
            icon={<CalendarClock size={18} />}
            label="Availability"
          />

          <SidebarLink
            href="/dashboard/analytics"
            icon={<BarChart3 size={18} />}
            label="Analytics"
          />
        </nav>

        <div className="absolute bottom-6 left-5 right-5">
          <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">Current Business</p>

            <p className="mt-1 text-sm font-semibold">RapidFlow Plumbing</p>
          </div>

          <SidebarLink
            href="/dashboard/settings"
            icon={<Settings size={18} />}
            label="Settings"
          />
        </div>
      </aside>

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur-xl lg:px-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                Operations Workspace
              </p>

              {/* <p className="mt-1 text-sm font-semibold text-slate-800">
                RapidFlow Plumbing
              </p> */}
            </div>

            <div className="flex items-center gap-3">
              {/* <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-900">
                  Admin User
                </p>
                <p className="text-xs text-slate-500">Business Manager</p>
              </div> */}

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                RF
              </div>
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}

function SidebarLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}


