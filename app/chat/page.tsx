import { Suspense } from "react";
import ChatClient from "./ChatClient";

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-100">
          <p className="text-slate-500">Loading chat...</p>
        </main>
      }
    >
      <ChatClient />
    </Suspense>
  );
}
