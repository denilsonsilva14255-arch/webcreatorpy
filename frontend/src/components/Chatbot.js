import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, MessageCircle } from "lucide-react";
import { WA_DEFAULT_LINK } from "@/lib/site";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const GREETING = {
    role: "assistant",
    content:
        "¡Hola! Soy Sofi de WebCreator PY 👋 ¿Qué modelo buscás: Landing, Catálogo, Tienda o a medida?",
};
const NUDGE = {
    role: "assistant",
    content: "¿Te armo un presupuesto a tu medida sin compromiso? 👈",
};

const newSessionId = () =>
    (crypto.randomUUID ? crypto.randomUUID() : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`);

function getSessionId() {
    let id = sessionStorage.getItem("wcpy_chat_session");
    if (!id) {
        id = newSessionId();
        sessionStorage.setItem("wcpy_chat_session", id);
    }
    return id;
}

function linkifyPlain(text, keyPrefix, out) {
    const re = /(https?:\/\/[^\s<)]+)/g;
    let last = 0;
    let m;
    while ((m = re.exec(text))) {
        if (m.index > last) out.push(text.slice(last, m.index));
        out.push(
            <a
                key={`${keyPrefix}-u${m.index}`}
                href={m[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon underline decoration-neon/50 underline-offset-2"
            >
                {m[0]}
            </a>,
        );
        last = m.index + m[0].length;
    }
    if (last < text.length) out.push(text.slice(last));
}

function RenderContent({ text }) {
    const out = [];
    let rest = String(text || "");
    let key = 0;
    const md = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/;
    while (true) {
        const m = rest.match(md);
        if (!m) break;
        if (m.index > 0) linkifyPlain(rest.slice(0, m.index), `p${key}`, out);
        key += 1;
        out.push(
            <a
                key={`md${key}`}
                href={m[2]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1.5 rounded-full border border-neon/40 bg-neon/10 px-3 py-1.5 text-xs font-semibold text-neon transition-[background-color,box-shadow] duration-200 hover:bg-neon/20 hover:shadow-[0_0_15px_rgba(0,255,170,0.25)]"
            >
                👉 {m[1]}
            </a>,
        );
        rest = rest.slice(m.index + m[0].length);
    }
    linkifyPlain(rest, `p${key}`, out);
    return <span>{out}</span>;
}

export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const sessionRef = useRef(null);
    const scrollRef = useRef(null);
    const nudgedForRef = useRef(0);
    const pendingNudgeRef = useRef(false);

    if (sessionRef.current === null) sessionRef.current = getSessionId();

    useEffect(() => {
        if (!open) return;
        fetch(`${API}/chat/${sessionRef.current}`)
            .then((r) => r.json())
            .then((h) => {
                const base = Array.isArray(h) && h.length ? h : [GREETING];
                if (pendingNudgeRef.current) {
                    pendingNudgeRef.current = false;
                    nudgedForRef.current = base.length + 1;
                    setMessages([...base, NUDGE]);
                } else {
                    setMessages(base);
                }
            })
            .catch(() => setMessages([GREETING]));
    }, [open]);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    }, [messages, typing]);

    // MODO 2 - AVISADOR: si el cliente no responde en 15 segundos
    useEffect(() => {
        if (!open || typing || !messages.length) return;
        const last = messages[messages.length - 1];
        if (last.role !== "assistant") return;
        if (nudgedForRef.current === messages.length) return;
        if (last.content.includes("sin compromiso")) return;
        const id = setTimeout(() => {
            nudgedForRef.current = messages.length;
            setMessages((m) => [...m, NUDGE]);
        }, 15000);
        return () => clearTimeout(id);
    }, [open, typing, messages]);

    const close = () => {
        const last = messages[messages.length - 1];
        if (last && last.role === "assistant" && nudgedForRef.current !== messages.length) {
            pendingNudgeRef.current = true;
        }
        setOpen(false);
    };

    const send = async (raw) => {
        const text = (raw ?? input).trim();
        if (!text || typing) return;
        setInput("");
        setMessages((m) => [...m, { role: "user", content: text }]);
        setTyping(true);
        setMessages((m) => [...m, { role: "assistant", content: "" }]);
        try {
            const res = await fetch(`${API}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_id: sessionRef.current, message: text }),
            });
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buf = "";
            let acc = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buf += decoder.decode(value, { stream: true });
                const parts = buf.split("\n\n");
                buf = parts.pop();
                for (const part of parts) {
                    const line = part.trim();
                    if (!line.startsWith("data:")) continue;
                    const payload = JSON.parse(line.slice(5));
                    if (payload.type === "delta") {
                        acc += payload.content;
                        setMessages((m) => {
                            const copy = [...m];
                            copy[copy.length - 1] = { role: "assistant", content: acc };
                            return copy;
                        });
                    } else if (payload.type === "replace") {
                        acc = payload.content;
                        setMessages((m) => {
                            const copy = [...m];
                            copy[copy.length - 1] = { role: "assistant", content: acc };
                            return copy;
                        });
                    }
                }
            }
            if (!acc) {
                setMessages((m) => {
                    const copy = [...m];
                    copy[copy.length - 1] = {
                        role: "assistant",
                        content: "No pude responder ahora. Escribinos por WhatsApp: https://wa.me/595971758226",
                    };
                    return copy;
                });
            }
        } catch (e) {
            setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = {
                    role: "assistant",
                    content:
                        "Problema de conexión. Escribinos por WhatsApp https://wa.me/595971758226 o al email webcreatorpy99@gmail.com",
                };
                return copy;
            });
        }
        setTyping(false);
    };

    return (
        <>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.94 }}
                        transition={{ type: "spring", stiffness: 260, damping: 24 }}
                        data-testid="chatbot-panel"
                        className="fixed bottom-24 left-4 z-50 flex h-[480px] w-[360px] max-w-[calc(100vw-2rem)] origin-bottom-left flex-col overflow-hidden rounded-2xl border border-neon/25 bg-ink/95 shadow-[0_20px_70px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:left-6"
                    >
                        <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-neon/10 to-transparent px-5 py-4">
                            <div className="flex items-center gap-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-neon/40 bg-obsidian">
                                    <Bot size={17} className="text-neon" />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-white">Sofi — WebCreator PY</p>
                                    <p className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#28C840]" />
                                        En línea — responde al instante
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <a
                                    data-testid="chatbot-whatsapp-link"
                                    href={WA_DEFAULT_LINK}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Abrir WhatsApp"
                                    className="rounded-lg p-2 text-slate-400 transition-colors duration-200 hover:bg-white/5 hover:text-[#25D366]"
                                >
                                    <MessageCircle size={17} />
                                </a>
                                <button
                                    data-testid="chatbot-close"
                                    onClick={close}
                                    aria-label="Cerrar chat"
                                    className="rounded-lg p-2 text-slate-400 transition-colors duration-200 hover:bg-white/5 hover:text-white"
                                >
                                    <X size={17} />
                                </button>
                            </div>
                        </div>

                        <div ref={scrollRef} data-testid="chatbot-messages" className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    data-testid={`chatbot-message-${m.role}`}
                                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                                        m.role === "user"
                                            ? "ml-auto rounded-br-sm border border-neon/30 bg-neon/15 text-white"
                                            : "mr-auto rounded-bl-sm border border-white/10 bg-white/[0.05] text-slate-200"
                                    }`}
                                >
                                    {m.content ? (
                                        <RenderContent text={m.content} />
                                    ) : (
                                        <span className="flex gap-1 py-1">
                                            {[0, 1, 2].map((d) => (
                                                <span
                                                    key={d}
                                                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-neon/70"
                                                    style={{ animationDelay: `${d * 0.15}s` }}
                                                />
                                            ))}
                                        </span>
                                    )}
                                </div>
                            ))}
                            {messages.length <= 1 && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {["Quiero mi web", "¿Cómo empiezo?", "Tengo un restaurante"].map((q) => (
                                        <button
                                            key={q}
                                            data-testid={`chatbot-suggestion-${q.length}`}
                                            onClick={() => send(q)}
                                            className="rounded-full border border-neon/40 px-3 py-1.5 text-xs text-neon transition-[background-color,box-shadow] duration-200 hover:bg-neon/10 hover:shadow-[0_0_15px_rgba(0,255,170,0.2)]"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="border-t border-white/10 p-3">
                            <div className="flex items-center gap-2">
                                <input
                                    data-testid="chatbot-input"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && send()}
                                    placeholder="Escribí tu mensaje…"
                                    className="flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-[border-color] duration-200 focus:border-neon/50"
                                />
                                <button
                                    data-testid="chatbot-send"
                                    onClick={() => send()}
                                    disabled={typing || !input.trim()}
                                    aria-label="Enviar mensaje"
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-neon to-emerald-500 text-obsidian shadow-[0_0_20px_rgba(0,255,170,0.3)] transition-[transform,opacity] duration-200 hover:scale-105 disabled:opacity-40"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                data-testid="chatbot-bubble"
                onClick={() => setOpen((o) => !o)}
                aria-label="Abrir chat con Sofi"
                className="glass fixed bottom-6 left-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-[0_0_30px_rgba(0,255,170,0.2)] transition-transform duration-300 hover:scale-110 sm:left-6"
            >
                <Bot size={24} className="text-neon" />
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center">
                    <span className="absolute h-full w-full animate-ping rounded-full bg-neon/60" />
                    <span className="h-2 w-2 rounded-full bg-neon" />
                </span>
            </button>
        </>
    );
}
