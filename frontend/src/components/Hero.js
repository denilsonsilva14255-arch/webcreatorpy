import { useEffect, useRef, useState } from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    useScroll,
    useTransform,
} from "framer-motion";
import { ArrowRight, Bot, Zap } from "lucide-react";
import { scrollToSection } from "@/lib/site";

const LINE_1 = "TU IDEA,";
const LINE_2 = "NUESTRA CREACION";

function CodeDashboard() {
    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                <span className="ml-3 rounded-md bg-white/5 px-3 py-1 font-mono text-[10px] text-slate-400">
                    webcreatorpy.com/dashboard
                </span>
            </div>
            <div className="grid flex-1 grid-cols-[36px_1fr] overflow-hidden">
                <div className="border-r border-white/5 py-4 text-center font-mono text-[10px] leading-6 text-slate-600">
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                        <div key={n}>{n}</div>
                    ))}
                </div>
                <div className="py-4 pr-4 font-mono text-[11px] leading-6 sm:text-xs">
                    <div>
                        <span className="text-[#7DD3FC]">const</span>{" "}
                        <span className="text-slate-100">negocio</span>{" "}
                        <span className="text-slate-500">=</span>{" "}
                        <span className="text-neon">crearWeb</span>
                        <span className="text-slate-500">({"{"}</span>
                    </div>
                    <div className="pl-4">
                        <span className="text-slate-300">diseno</span>
                        <span className="text-slate-500">:</span>{" "}
                        <span className="text-emerald-400">"premium"</span>
                        <span className="text-slate-500">,</span>
                    </div>
                    <div className="pl-4">
                        <span className="text-slate-300">stack</span>
                        <span className="text-slate-500">:</span>{" "}
                        <span className="text-emerald-400">"Next.js"</span>
                        <span className="text-slate-500">,</span>
                    </div>
                    <div className="pl-4">
                        <span className="text-slate-300">ia</span>
                        <span className="text-slate-500">:</span>{" "}
                        <span className="text-[#7DD3FC]">true</span>
                        <span className="text-slate-500">,</span>
                    </div>
                    <div>
                        <span className="text-slate-500">{"}"});</span>
                        <span className="ml-1 inline-block h-3.5 w-2 translate-y-0.5 animate-blink bg-neon" />
                    </div>
                    <div>
                        <span className="text-slate-500">{"//"} build →</span>{" "}
                        <span className="text-neon">desplegado ✓</span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 border-t border-white/5 p-3">
                {["SEO 98/100", "IA ACTIVA", "24/7 ONLINE"].map((k) => (
                    <div
                        key={k}
                        className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-1.5 text-center font-mono text-[9px] text-neon/80 sm:text-[10px]"
                    >
                        {k}
                    </div>
                ))}
            </div>
            <div className="flex h-12 items-end gap-1.5 border-t border-white/5 px-4 pb-2">
                {[40, 65, 50, 80, 60, 95, 72].map((h, i) => (
                    <span
                        key={i}
                        className="w-full origin-bottom animate-bar-grow rounded-sm bg-gradient-to-t from-emerald-500/60 to-neon/80"
                        style={{ height: `${h}%`, animationDelay: `${i * 0.18}s` }}
                    />
                ))}
            </div>
        </div>
    );
}

export default function Hero() {
    const [count, setCount] = useState(0);
    const heroRef = useRef(null);

    const rx = useMotionValue(0);
    const ry = useMotionValue(0);
    const rotateX = useSpring(rx, { stiffness: 55, damping: 14 });
    const rotateY = useSpring(ry, { stiffness: 55, damping: 14 });

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const laptopY = useTransform(scrollYProgress, [0, 1], [0, 70]);
    const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    const total = LINE_1.length + LINE_2.length;
    useEffect(() => {
        if (count >= total) return;
        const speed = count < LINE_1.length ? 85 : 62;
        const timeout = setTimeout(
            () => setCount((c) => c + 1),
            count === 0 ? 650 : speed,
        );
        return () => clearTimeout(timeout);
    }, [count, total]);

    const typed1 = LINE_1.slice(0, count);
    const typed2 = LINE_2.slice(0, Math.max(0, count - LINE_1.length));
    const typing = count < total;

    const onMove = (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
    };

    return (
        <section
            id="inicio"
            ref={heroRef}
            className="relative flex min-h-screen items-center overflow-hidden pt-24 pb-16 lg:pt-20"
        >
            <div className="pointer-events-none absolute left-1/2 top-1/3 h-[560px] w-[900px] max-w-[120vw] -translate-x-1/2 rounded-full bg-neon/[0.05] blur-[140px]" />

            <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 px-6 lg:grid-cols-[1.05fr_0.95fr]">
                <motion.div style={{ opacity: fade }}>
                    <motion.p
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="font-mono text-xs uppercase tracking-[0.4em] text-neon"
                        data-testid="hero-eyebrow"
                    >
                        Agencia digital — Paraguay
                    </motion.p>

                    <h1
                        data-testid="hero-title"
                        className="mt-6 font-display text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-5xl"
                    >
                        <span className="block">{typed1}</span>
                        <span className="text-neon-gradient block">
                            {typed2}
                            <span
                                data-testid="hero-typewriter-cursor"
                                className="ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.12em] animate-blink bg-neon align-middle"
                            />
                        </span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 1.9 }}
                        className="mt-6 max-w-lg text-base leading-relaxed text-slate-400 sm:text-lg"
                        data-testid="hero-subtitle"
                    >
                        Agencia digital especializada en desarrollo web y
                        automatización con IA en Paraguay.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 2.15 }}
                        className="mt-9 flex flex-wrap items-center gap-4"
                    >
                        <button
                            data-testid="hero-cta-empezar"
                            onClick={() => scrollToSection("contacto")}
                            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-neon to-emerald-500 px-7 py-3.5 text-sm font-bold text-obsidian shadow-[0_0_35px_rgba(0,255,170,0.3)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_55px_rgba(0,255,170,0.5)]"
                        >
                            Empezar proyecto
                            <ArrowRight
                                size={17}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </button>
                        <button
                            data-testid="hero-cta-portfolio"
                            onClick={() => scrollToSection("portafolio")}
                            className="glass inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-slate-200 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-neon/50 hover:text-neon hover:shadow-[0_0_30px_rgba(0,255,170,0.2)]"
                        >
                            Ver portfolio
                        </button>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40, rotateY: -8 }}
                    animate={{ opacity: 1, y: 0, rotateY: 0 }}
                    transition={{ duration: 1.1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ y: laptopY, perspective: 1200 }}
                    onMouseMove={onMove}
                    onMouseLeave={() => {
                        rx.set(0);
                        ry.set(0);
                    }}
                    className="relative mx-auto w-full max-w-[540px]"
                    data-testid="hero-laptop"
                >
                    <div className="absolute inset-8 rounded-full bg-neon/15 blur-[70px]" />

                    <motion.div
                        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                        className="relative"
                    >
                        <motion.div
                            animate={{ y: [-9, 9, -9] }}
                            transition={{
                                duration: 7,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <div className="rounded-t-2xl border border-neon/20 bg-panel shadow-[0_0_60px_rgba(0,255,170,0.12)]">
                                <CodeDashboard />
                            </div>
                            <div className="relative mx-auto h-3.5 w-[108%] max-w-none -translate-x-[3.7%] rounded-b-2xl rounded-t-sm bg-gradient-to-b from-slate-700/80 to-slate-800/40">
                                <span className="absolute left-1/2 top-0 h-1 w-16 -translate-x-1/2 rounded-b-md bg-black/50" />
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [-6, 10, -6] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                            className="glass absolute -left-6 top-8 hidden items-center gap-2 rounded-full px-4 py-2 sm:-left-10 sm:flex"
                        >
                            <Zap size={14} className="text-neon" />
                            <span className="font-mono text-[11px] text-slate-200">Next.js</span>
                        </motion.div>
                        <motion.div
                            animate={{ y: [8, -8, 8] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
                            className="glass absolute -right-4 bottom-28 hidden items-center gap-2 rounded-full px-4 py-2 sm:-right-8 sm:flex"
                        >
                            <Bot size={14} className="text-neon" />
                            <span className="font-mono text-[11px] text-slate-200">IA + Automatización</span>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>

            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-obsidian"
                aria-hidden="true"
            />
        </section>
    );
}
