import { motion } from "framer-motion";
import { Check, ArrowRight, MessageCircle } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { waLink } from "@/lib/site";
import { fadeUp, stagger, viewport } from "@/lib/motion";

const BUDGET_LINK = waLink("Hola quiero presupuesto gratis");

const PLANS = [
    {
        id: "emprendedor",
        name: "Emprendedor",
        price: "Gs. 800.000",
        desc: "Te armamos tu presupuesto",
        features: [
            "Sitio de 1 página",
            "Diseño responsivo",
            "Botón de WhatsApp",
            "SEO básico",
            "Entrega en 7 días",
        ],
        popular: false,
    },
    {
        id: "negocio",
        name: "Negocio",
        price: "Gs. 1.700.000",
        desc: "Solución completa, cotizamos según tu rubro",
        features: [
            "Hasta 5 secciones",
            "Animaciones premium",
            "Blog o galería",
            "Chatbot IA básico",
            "SEO avanzado",
            "Soporte 3 meses",
        ],
        popular: true,
    },
    {
        id: "premium",
        name: "Premium",
        price: "Gs. 2.850.000",
        desc: "Marca grande, presupuesto a medida",
        features: [
            "Web a medida ilimitada",
            "Automatización IA avanzada",
            "Integraciones (pagos, CRM)",
            "Dashboard de métricas",
            "Soporte 12 meses",
        ],
        popular: false,
    },
];

export default function Pricing() {
    return (
        <section id="precios" className="relative z-10 py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-6">
                <SectionHeader
                    id="precios"
                    eyebrow="// Precios"
                    title="Tu presupuesto, a medida"
                    sub="Cada negocio es distinto: cotizamos según tu rubro y lo que tu proyecto necesita."
                />

                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={viewport}
                    className="mt-16 grid items-stretch gap-6 lg:grid-cols-3"
                >
                    {PLANS.map((p) => (
                        <motion.div
                            key={p.id}
                            variants={fadeUp}
                            data-testid={`pricing-card-${p.id}`}
                            className={`relative flex h-full flex-col rounded-2xl border p-8 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1.5 ${
                                p.popular
                                    ? "border-neon/60 bg-ink/80 shadow-[0_0_50px_rgba(0,255,170,0.16)]"
                                    : "border-white/10 bg-ink/70 hover:border-neon/40"
                            }`}
                        >
                            {p.popular && (
                                <span
                                    data-testid="pricing-badge-popular"
                                    className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#00FF41] px-4 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-obsidian shadow-[0_0_25px_rgba(0,255,41,0.5)]"
                                >
                                    Más Popular
                                </span>
                            )}
                            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
                                Plan {p.name}
                            </h3>
                            <p className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                {p.price}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.desc}</p>
                            <ul className="mt-6 flex-1 space-y-3">
                                {p.features.map((f) => (
                                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                                        <Check size={16} className="mt-0.5 shrink-0 text-neon" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <a
                                data-testid={`pricing-cta-${p.id}`}
                                href={BUDGET_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-center text-sm font-bold transition-[box-shadow,transform,background-color,border-color] duration-300 hover:-translate-y-0.5 ${
                                    p.popular
                                        ? "bg-gradient-to-r from-neon to-emerald-500 text-obsidian shadow-[0_0_30px_rgba(0,255,170,0.35)] hover:shadow-[0_0_50px_rgba(0,255,170,0.55)]"
                                        : "border border-neon/40 text-neon hover:bg-neon/10 hover:shadow-[0_0_25px_rgba(0,255,170,0.2)]"
                                }`}
                            >
                                Solicitar Presupuesto Gratis
                                <ArrowRight size={16} />
                            </a>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.p
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={viewport}
                    data-testid="pricing-budget-note"
                    className="mt-10 flex items-center justify-center gap-2 text-center font-mono text-xs uppercase tracking-[0.25em] text-slate-400"
                >
                    <MessageCircle size={14} className="shrink-0 text-neon" />
                    Presupuesto gratis en 24hs por WhatsApp
                </motion.p>
            </div>
        </section>
    );
}
