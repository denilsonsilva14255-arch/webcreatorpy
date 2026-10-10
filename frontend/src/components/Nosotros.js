import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { fadeUp, stagger, viewport } from "@/lib/motion";
import { DiamondMark } from "@/components/Navbar";

function CountUp({ to, decimals = 0, prefix = "", suffix = "" }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.6 });
    const [val, setVal] = useState(0);

    useEffect(() => {
        if (!inView) return;
        const controls = animate(0, to, {
            duration: 1.8,
            ease: [0.22, 1, 0.36, 1],
            onUpdate: (v) => setVal(v),
        });
        return () => controls.stop();
    }, [inView, to]);

    return (
        <span ref={ref}>
            {prefix}
            {val.toFixed(decimals)}
            {suffix}
        </span>
    );
}

const STATS = [
    { id: "proyectos", node: <CountUp to={50} prefix="+" />, label: "Proyectos entregados" },
    { id: "satisfaccion", node: <CountUp to={99.8} decimals={1} suffix="%" />, label: "Clientes satisfechos" },
    { id: "automatizacion", node: <span>24/7</span>, label: "Automatización IA" },
    { id: "retorno", node: <CountUp to={3.5} decimals={1} suffix="x" />, label: "Retorno promedio" },
];

export default function Nosotros() {
    return (
        <section id="nosotros" className="relative z-10 py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid items-center gap-14 lg:grid-cols-2">
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={viewport}
                    >
                        <motion.p
                            variants={fadeUp}
                            className="font-mono text-xs uppercase tracking-[0.35em] text-neon"
                        >
                            // Nosotros
                        </motion.p>
                        <motion.h2
                            variants={fadeUp}
                            className="mt-4 font-display text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl"
                        >
                            Un estudio digital desde Asunción para el mundo
                        </motion.h2>
                        <motion.p variants={fadeUp} className="mt-5 leading-relaxed text-slate-400">
                            En WEB CREATOR PY combinamos diseño de alto nivel, código
                            propio y automatización con IA para lanzar sitios que no
                            solo se ven increíbles: venden. Trabajamos codo a codo con
                            cada cliente, desde la primera idea hasta el despliegue.
                        </motion.p>
                        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
                            {["Precisión extrema", "Entregas rápidas", "Soporte directo"].map((v) => (
                                <span
                                    key={v}
                                    className="glass rounded-full px-4 py-2 text-xs font-medium text-slate-200"
                                >
                                    {v}
                                </span>
                            ))}
                        </motion.div>
                    </motion.div>

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={viewport}
                        data-testid="nosotros-terminal"
                        className="overflow-hidden rounded-2xl border border-white/10 bg-panel/80 backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                            <span className="ml-3 font-mono text-[10px] text-slate-500">webcreator@py:~</span>
                        </div>
                        <div className="space-y-3 p-6 font-mono text-xs sm:text-sm">
                            {[
                                ["$ whoami", "webcreatorpy — agencia digital"],
                                ["$ location", "Asunción, Paraguay (UTC-3)"],
                                ["$ stack", "React · Next.js · Tailwind · IA"],
                                ["$ estado", "Aceptando proyectos"],
                            ].map(([cmd, out], i) => (
                                <div key={cmd}>
                                    <p className="text-slate-500">{cmd}</p>
                                    <p className={i === 3 ? "text-neon" : "text-slate-200"}>
                                        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-current align-middle" />
                                        {out}
                                        {i === 3 && (
                                            <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-neon align-middle" />
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={viewport}
                    data-testid="stats-bar"
                    className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 lg:grid-cols-4"
                >
                    {STATS.map((s) => (
                        <motion.div
                            key={s.id}
                            variants={fadeUp}
                            data-testid={`stat-${s.id}`}
                            className="flex flex-col items-center gap-2 bg-obsidian/80 px-6 py-10 text-center"
                        >
                            <span className="font-display text-3xl font-bold text-neon sm:text-4xl">
                                {s.node}
                            </span>
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                                {s.label}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
