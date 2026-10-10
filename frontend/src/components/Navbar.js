import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { scrollToSection } from "@/lib/site";

const LINKS = [
    { id: "inicio", label: "Inicio" },
    { id: "servicios", label: "Servicios" },
    { id: "portafolio", label: "Portafolio" },
    { id: "nosotros", label: "Nosotros" },
    { id: "contacto", label: "Contacto" },
];

export const DiamondMark = ({ className = "h-9 w-9" }) => (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <defs>
            <linearGradient id="dg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#00FFAA" />
                <stop offset="1" stopColor="#10B981" />
            </linearGradient>
        </defs>
        <rect
            x="17"
            y="17"
            width="30"
            height="30"
            rx="6"
            transform="rotate(45 32 32)"
            fill="none"
            stroke="url(#dg)"
            strokeWidth="3.5"
        />
        <rect
            x="25.5"
            y="25.5"
            width="13"
            height="13"
            rx="2.5"
            transform="rotate(45 32 32)"
            fill="url(#dg)"
        />
    </svg>
);

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const go = (id) => {
        setOpen(false);
        scrollToSection(id);
    };

    return (
        <header
            data-testid="navbar"
            className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,box-shadow] duration-500 ${
                scrolled
                    ? "border-b border-white/5 bg-obsidian/70 shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl"
                    : "border-b border-transparent bg-transparent"
            }`}
        >
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:h-20">
                <button
                    data-testid="nav-logo"
                    onClick={() => go("inicio")}
                    className="group flex items-center gap-3"
                    aria-label="WEB CREATOR PY — Inicio"
                >
                    <span className="transition-transform duration-500 group-hover:rotate-90">
                        <DiamondMark className="h-8 w-8 drop-shadow-[0_0_12px_rgba(0,255,170,0.65)]" />
                    </span>
                    <span className="font-display text-sm font-bold tracking-widest text-white sm:text-base">
                        WEB CREATOR <span className="text-neon">PY</span>
                    </span>
                </button>

                <ul className="hidden items-center gap-8 lg:flex">
                    {LINKS.map((l) => (
                        <li key={l.id}>
                            <button
                                data-testid={`nav-link-${l.id}`}
                                onClick={() => go(l.id)}
                                className="group relative text-sm font-medium text-slate-300 transition-colors duration-300 hover:text-white"
                            >
                                {l.label}
                                <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-neon transition-transform duration-300 group-hover:scale-x-100" />
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-3">
                    <button
                        data-testid="nav-cta-hablemos"
                        onClick={() => go("contacto")}
                        className="hidden rounded-full border border-neon/50 px-5 py-2 text-sm font-semibold text-neon shadow-[0_0_18px_rgba(0,255,170,0.15)] transition-[border-color,box-shadow,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-neon hover:bg-neon/10 hover:shadow-[0_0_30px_rgba(0,255,170,0.35)] sm:block"
                    >
                        Hablemos
                    </button>
                    <button
                        data-testid="nav-toggle"
                        onClick={() => setOpen((o) => !o)}
                        className="rounded-lg border border-white/10 p-2 text-slate-200 lg:hidden"
                        aria-label="Abrir menú"
                    >
                        {open ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="glass mx-4 mb-4 rounded-2xl p-4 lg:hidden"
                        data-testid="nav-mobile-menu"
                    >
                        {LINKS.map((l) => (
                            <button
                                key={l.id}
                                data-testid={`nav-mobile-link-${l.id}`}
                                onClick={() => go(l.id)}
                                className="block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-200 transition-colors duration-200 hover:bg-white/5 hover:text-neon"
                            >
                                {l.label}
                            </button>
                        ))}
                        <button
                            data-testid="nav-mobile-cta-hablemos"
                            onClick={() => go("contacto")}
                            className="mt-2 w-full rounded-xl border border-neon/50 px-4 py-3 text-sm font-semibold text-neon"
                        >
                            Hablemos
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
