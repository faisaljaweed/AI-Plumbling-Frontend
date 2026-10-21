"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ChatBox from "@/components/ChatBox";
import EnquiryShell from "@/components/EnquiryShell";

export default function ChatClient() {
  const searchParams = useSearchParams();
  const leadId = Number(searchParams.get("leadId"));
  return <EnquiryShell step={2}>{Number.isSafeInteger(leadId) && leadId > 0 ? <ChatBox key={leadId} leadId={leadId} /> : <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center"><h2 className="text-xl font-semibold">Start with a customer enquiry</h2><p className="mt-3 text-sm text-slate-500">Create a lead to begin a conversation with the assistant.</p><Link href="/new-lead" className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white">Create new lead</Link></div>}</EnquiryShell>;
}
