"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronUp, Send } from "lucide-react";

type Message = { text: string; isUser: boolean };

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your Lotan Risk Advisor. How can I assist with credit protection or contract guarantees today?",
      isUser: false,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const q = input.trim();
    if (!q) return;
    setInput("");
    setMessages((m) => [...m, { text: q, isUser: true }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { text: data.response, isUser: false }]);
    } catch {
      setMessages((m) => [
        ...m,
        { text: "Risk Advisor offline. Please contact info@lia.insure.", isUser: false },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      id="ai-chat-widget"
      className={`fixed bottom-5 right-5 w-80 max-w-[calc(100vw-2rem)] bg-white/95 border border-slateBorder rounded-2xl shadow-2xl z-50 transition-transform duration-300 ${
        open ? "translate-y-0" : "translate-y-[calc(100%-48px)]"
      }`}
      role="complementary"
      aria-label="Risk advisor chat"
    >
      <button
        type="button"
        id="ai-chat-header"
        className="w-full bg-forest text-white p-3.5 rounded-t-2xl flex justify-between items-center"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider">Lotan Risk Advisor</span>
        </div>
        <ChevronUp className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div className="h-72 flex flex-col bg-platinum">
        <div id="ai-chat-messages" className="flex-grow p-4 overflow-y-auto flex flex-col gap-3" aria-live="polite">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`text-xs p-3 rounded-xl shadow-sm max-w-[85%] leading-relaxed ${
                msg.isUser
                  ? "bg-forest text-white rounded-tr-none self-end"
                  : "bg-white border border-slateBorder text-charcoal rounded-tl-none self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="text-xs p-3 rounded-xl self-start bg-white border border-slateBorder opacity-55 animate-pulse">
              Analyzing…
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="p-3 border-t border-slateBorder bg-white rounded-b-2xl">
          <div className="flex items-center gap-2 bg-platinum rounded-full px-3 py-2 border border-slateBorder">
            <input
              type="text"
              id="ai-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), send())}
              placeholder="Ask a question..."
              className="bg-transparent border-none outline-none text-xs w-full text-charcoal"
              aria-label="Chat message"
            />
            <button type="button" onClick={send} className="text-forest hover:text-accent" aria-label="Send message">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
