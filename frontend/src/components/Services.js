import { motion } from "framer-motion";
import { PenTool, Code2, Bot, ChevronRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { fadeUp, stagger, viewport } from "@/lib/motion";

const SERVICES = [
    {
        id: "ui-ux",
        icon: PenTool,
        title: "Diseño UI/UX",
        desc: "Interfaces que enamoran y convierten. Diseñamos experiencias memorables centradas en tus usuarios.",
        items: ["Wireframes y prototipos", "Design systems", "Research de usuarios"],
    },
    {
        id: "web",
        icon: Code2,
        title: "Desarrollo Web React / Next.js",
        desc: "Código limpio, rápido y escalable. Sitios y aplicaciones que cargan al instante y posicionan en Google.",
        items: ["Apps web a medida", "E-commerce", "SEO técnico"],
    },
    {
        id: "ia",
        icon: Bot,
        title: "Automatización con IA",
        desc: "Chatbots y flujos inteligentes que atienden, venden y responden por ti las 24 horas del día.",
        items: ["Chatbots de WhatsApp", "Integración con IA", "Flujos automatizados"],
    },
];

export default function Services() {
    return (
        <section id="servicios" className="relative z-10 py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-6">
                <SectionHeader
                    id="servicios"
                    eyebrow="// Servicios"
                    title="Lo que hacemos mejor"
                    sub="Tres especialidades, un objetivo: que tu negocio venda más con una web de otro nivel."
                />

                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={viewport}
                    className="mt-16 grid gap-6 md:grid-cols-3"
                >
                    {SERVICES.map((s) => (
                        <motion.article
                            key={s.id}
                            variants={fadeUp}
                            data-testid={`service-card-${s.id}`}
                            className="group relative rounded-2xl border border-white/10 bg-ink/70 p-8 backdrop-blur-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1.5 hover:border-neon/60 hover:shadow-[0_0_45px_rgba(0,255,170,0.15)]"
                        >
                            <div className="inline-flex rounded-xl border border-neon/25 bg-neon/5 p-3 transition-[box-shadow,background-color] duration-300 group-hover:bg-neon/10 group-hover:shadow-[0_0_25px_rgba(0,255,170,0.3)]">
                                <s.icon size={26} className="text-neon" strokeWidth={1.8} />
                            </div>
                            <h3 className="mt-6 font-display text-lg font-semibold tracking-tight text-white">
                                {s.title}
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-slate-400">
                                {s.desc}
                            </p>
                            <ul className="mt-6 space-y-2.5">
                                {s.items.map((it) => (
                                    <li
                                        key={it}
                                        className="flex items-center gap-2 text-sm text-slate-300"
                                    >
                                        <ChevronRight size={15} className="shrink-0 text-neon" />
                                        {it}
                                    </li>
                                ))}
                            </ul>
                            <span className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-neon/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
