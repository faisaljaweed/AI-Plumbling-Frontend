"use client";

import { useEffect, useRef, useState } from "react";
import { getChatHistory, sendChatMessage, startChat, type Booking } from "@/lib/api";
import { Bot, Send, LoaderCircle, CheckCheck, RefreshCw } from "lucide-react";
import BookingSlots from "@/components/BookingSlots";

type Message = {
  id?: number;
  role: "user" | "assistant";
  content: string;
};

export default function ChatBox({ leadId }: { leadId: number }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [qualified, setQualified] = useState(false);
  const [booking,setBooking]=useState<Booking|null>(null);
  const [mode,setMode]=useState("guided");
  const [initError, setInitError] = useState(false);
  const [retry, setRetry] = useState(0);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setLoading(true);
        setInitError(false);

        const historyResponse = await getChatHistory(leadId);

        setQualified(Boolean(historyResponse.qualified));
        setBooking(historyResponse.booking || null);
        if (historyResponse.data?.length > 0) {
          setMessages(historyResponse.data);
          return;
        }

        const startResponse = await startChat(leadId);

        if(startResponse.data?.messages) setMessages(startResponse.data.messages);
        setBooking(startResponse.data?.booking || null);
        setQualified(Boolean(startResponse.data?.qualified));
        setMode(startResponse.data?.mode || "guided");
        if (startResponse.data?.reply && !startResponse.data?.messages) {
          setMessages([
            {
              role: "assistant",
              content: startResponse.data.reply,
            },
          ]);

          if (startResponse.data.qualified) {
            setQualified(true);
          }
        }
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        setInitError(true);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [leadId, retry]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading, qualified]);

  const handleSend = async () => {
    if (!message.trim() || loading || initError) return;

    const currentMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: currentMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await sendChatMessage(leadId, currentMessage);

      setBooking(response.data?.booking || null);
      setMode(response.data?.mode || "guided");
      if (response.data?.qualified) {
        setQualified(true);
      }

      if (response.data?.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response.data.reply,
          },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section aria-label="AI conversation" className="flex h-[min(740px,85dvh)] min-h-[480px] w-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_40px_-20px_#15264d30]">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-7">
        <div className="flex items-center gap-3"><span className="relative rounded-2xl bg-blue-50 p-3 text-blue-600"><Bot size={24} /><span className="absolute bottom-2 right-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" /></span><div><h1 className="font-semibold text-slate-900">RapidFlow Assistant</h1><p className="mt-1 text-xs text-slate-500">{mode === "ai" ? "AI-powered plumbing support" : "Guided plumbing support"}</p></div></div>
      </div>
      <div role="log" aria-label="Messages" aria-live="polite" className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-[#f8fafd] p-5 sm:p-7">
        <div className="mb-6 flex items-center justify-center gap-2 text-[11px] text-slate-400"><CheckCheck size={14} />{booking ? "Your appointment is confirmed" : qualified ? "Ready to book your service" : "Let’s understand your service request"}</div>
        {messages.map((item, index) => (
          <div key={item.id ?? `${item.role}-${index}`} className={`flex items-end gap-2.5 ${item.role === "user" ? "justify-end" : "justify-start"}`}>
            {item.role === "assistant" && <span className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600"><Bot size={16} /></span>}
            <div className="max-w-[85%] sm:max-w-[80%]"><p className={`mb-1.5 text-[10px] font-medium text-slate-400 ${item.role === "user" ? "text-right" : ""}`}>{item.role === "user" ? "You" : "RapidFlow"}</p><div className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 ${item.role === "user" ? "rounded-br-sm bg-blue-600 text-white shadow-sm shadow-blue-600/10" : "rounded-bl-sm border border-slate-200/70 bg-white text-slate-600 shadow-sm"}`}>{item.role === "assistant" ? item.content.replace(/\s*\(America\/Chicago\)/g, "").replace(/\s*All appointment times are in America\/Chicago\./g, "") : item.content}</div></div>
          </div>
        ))}
        {loading && <div role="status" className="flex items-center gap-2 text-xs text-slate-400"><LoaderCircle size={15} className="animate-spin" />{messages.length ? "Assistant is thinking…" : "Connecting to your assistant…"}</div>}
        {initError && <div role="alert" className="rounded-2xl border border-red-100 bg-white p-5 text-sm text-slate-600"><p>We couldn’t connect to the assistant. Please try again.</p><button type="button" onClick={() => setRetry(value => value + 1)} className="mt-3 flex items-center gap-2 font-semibold text-blue-600"><RefreshCw size={14} />Reconnect</button></div>}
        <div ref={bottomRef} />
      </div>
      {qualified && <div className="max-h-[35vh] overflow-y-auto border-t border-slate-100 bg-white px-5 py-4"><BookingSlots leadId={leadId} booking={booking} onBooked={newBooking=>{setBooking(newBooking);if(newBooking.confirmation_message)setMessages(prev=>[...prev,{role:"assistant",content:newBooking.confirmation_message!}]);}} /></div>}
      <div className="border-t border-slate-100 bg-white p-4 sm:px-6">
        <div className="flex gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/5">
          <input aria-label="Your message" type="text" maxLength={2000} value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyDown} disabled={loading || initError} placeholder={qualified ? "Have another question?" : "Describe your plumbing issue…"} className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400" />
          <button type="button" aria-label="Send message" onClick={handleSend} disabled={loading || initError || !message.trim()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"><Send size={18} /></button>
        </div>
        <p className="mt-3 text-center text-[10px] text-slate-400">{mode === "ai" ? "Powered by RapidFlow AI" : "Guided assistant · Available even when AI is busy"}</p>
      </div>
    </section>
  );
}
