import { MessageCircle, Send, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { CHAT_ROUTES } from "../constants/endpoints";
import axiosInstance from "../lib/axios";

const WELCOME =
  "Hi! I am your OrderKaro assistant. Ask me about browsing food, cart, checkout, or running your shop.";

function ChatAssistant() {
  const { userData } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: WELCOME },
  ]);
  const listRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, open, scrollToBottom]);

  if (!userData) return null;

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nextUser = { role: "user", content: trimmed };
    const historyForApi = [...messages, nextUser].filter(
      (m) => m.role === "user" || m.role === "assistant",
    );

    setMessages((prev) => [...prev, nextUser]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axiosInstance.post(CHAT_ROUTES.COMPLETION, {
        messages: historyForApi,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "Something went wrong. Try again in a moment.";
      toast.error(msg);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I could not reach the assistant. Add GROQ_API_KEY to backend/.env, then restart the server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[10000] flex flex-col items-end gap-3 font-sans">
      {open && (
        <div
          className="flex w-[min(100vw-2.5rem,22rem)] max-h-[min(70vh,28rem)] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl shadow-stone-900/10"
          role="dialog"
          aria-label="OrderKaro chat assistant"
        >
          <div className="flex items-center justify-between border-b border-stone-100 bg-linear-to-r from-amber-50 via-white to-orange-50 px-4 py-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-400">
                Help
              </p>
              <h2 className="text-base font-bold tracking-tight text-stone-900">
                Order<span className="text-orange-500">Karo</span> Assistant
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700 cursor-pointer"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          <div
            ref={listRef}
            className="flex min-h-[12rem] flex-1 flex-col gap-3 overflow-y-auto bg-linear-to-b from-stone-50/80 to-amber-50/30 px-3 py-4"
          >
            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                    m.role === "user"
                      ? "bg-orange-500 text-white rounded-br-md"
                      : "border border-stone-100 bg-white text-stone-700 rounded-bl-md"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl rounded-bl-md border border-stone-100 bg-white px-4 py-3 shadow-sm">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-orange-400 [animation-delay:-0.2s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-orange-400 [animation-delay:-0.1s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-orange-400" />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-stone-100 bg-white p-3">
            <div className="flex items-end gap-2 rounded-xl border border-stone-200 bg-stone-50/80 px-2 py-1.5 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Ask about orders, menu, cart…"
                className="max-h-24 min-h-[2.25rem] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-stone-800 outline-none placeholder:text-stone-400"
                disabled={loading}
                aria-label="Message"
              />
              <button
                type="button"
                onClick={send}
                disabled={loading || !input.trim()}
                className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-900 text-white transition-colors hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/35 ring-4 ring-white transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        aria-expanded={open}
        aria-label={open ? "Close assistant" : "Open assistant"}
      >
        {open ? <X size={22} /> : <MessageCircle size={26} strokeWidth={2} />}
      </button>
    </div>
  );
}

export default ChatAssistant;
