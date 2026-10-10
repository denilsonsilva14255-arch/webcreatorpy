import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { waLink } from "@/lib/site";
import { fadeUp, stagger, viewport } from "@/lib/motion";

const BrowserBar = ({ url }) => (
    <div className="flex items-center gap-2 border-b border-white/5 bg-obsidian/80 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-3 flex-1 truncate rounded-md bg-white/5 px-3 py-1 font-mono text-[10px] text-slate-500">
            {url}
        </span>
    </div>
);

const CellShopMockup = ({ wa }) => (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#F7F8FB] to-[#E7EBF2]">
        <div className="flex items-center justify-between px-5 pt-4">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-slate-900">
                CELL SHOP PY
            </span>
            <div className="flex items-center gap-2">
                <span className="h-1.5 w-7 rounded-full bg-slate-300" />
                <span className="h-1.5 w-5 rounded-full bg-slate-300" />
                <span className="relative flex h-4 w-4 items-center justify-center rounded-md border border-slate-400">
                    <span className="h-1.5 w-1.5 rounded-sm bg-slate-700" />
                    <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[#25D366]" />
                </span>
            </div>
        </div>
        <div className="mx-5 mt-3 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
            <span className="h-2 w-2 rounded-full border-2 border-slate-400" />
            <span className="font-mono text-[9px] text-slate-400">Buscar iPhone, Samsung…</span>
        </div>
        <div className="mx-5 mt-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2">
            <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-blue-500">
                Nuevos lanzamientos
            </p>
            <p className="font-display text-[11px] font-bold text-slate-900">
                iPhone 15 Pro · Samsung S24
            </p>
        </div>
        <div className="grid grid-cols-3 gap-2 px-5 pt-3">
            {[
                { name: "iPhone 15", g: "from-slate-300 to-slate-500" },
                { name: "Samsung A55", g: "from-indigo-200 to-slate-600" },
                { name: "Poco X6", g: "from-amber-200 to-slate-500" },
            ].map((p) => (
                <div key={p.name} className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
                    <div className={`mx-auto h-12 w-6 rounded-[5px] border border-slate-300 bg-gradient-to-b ${p.g}`}>
                        <span className="mx-auto mt-0.5 block h-1 w-3 rounded-b bg-white/60" />
                    </div>
                    <p className="mt-1.5 truncate text-center text-[8px] font-semibold text-slate-800">
                        {p.name}
                    </p>
                </div>
            ))}
        </div>
        <div className="mt-auto px-5 pb-5 pt-3">
            <a
                href={wa.href}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`portfolio-mock-button-${wa.id}`}
                className="flex w-full items-center justify-center rounded-full bg-[#25D366] py-2 text-[10px] font-bold text-white shadow-md"
            >
                {wa.label}
            </a>
        </div>
    </div>
);

const MotoMockup = ({ wa }) => (
    <div className="flex h-full flex-col bg-gradient-to-br from-[#14100A] via-[#1C140B] to-[#0C0A08]">
        <div className="h-1.5 w-full bg-[repeating-linear-gradient(45deg,#F97316_0_10px,#14100A_10px_20px)]" />
        <div className="flex items-center justify-between px-5 pt-3">
            <span className="font-mono text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#FB923C]">
                MOTO REPUESTOS <span className="text-white">CDE</span>
            </span>
            <span className="border-2 border-[#F97316]/60 px-1.5 py-0.5 font-mono text-[7px] font-bold text-[#F97316]">
                ENVÍOS CDE
            </span>
        </div>
        <div className="mx-5 mt-3 flex items-center gap-2 border-2 border-[#F97316]/50 bg-black/60 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full border-2 border-[#F97316]" />
            <span className="flex-1 truncate font-mono text-[9px] text-stone-400">
                Buscar por modelo… Ej: Honda Wave 110
            </span>
            <span className="bg-[#F97316] px-2 py-0.5 text-[8px] font-bold text-black">BUSCAR</span>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5 px-5">
            {["Cascos", "Cubiertas", "Aceites", "Frenos"].map((c, i) => (
                <span
                    key={c}
                    className={`px-2.5 py-0.5 text-[8px] font-bold uppercase ${
                        i === 0
                            ? "bg-[#F97316] text-black"
                            : "border border-white/20 text-stone-400"
                    }`}
                >
                    {c}
                </span>
            ))}
        </div>
        <div className="mt-auto grid grid-cols-3 gap-2 px-5 pb-3 pt-2">
            <div className="border border-white/10 bg-black/50 p-2 text-center">
                <div className="relative mx-auto mt-1 h-8 w-9 rounded-t-full border border-orange-300/40 bg-gradient-to-b from-orange-400/70 to-stone-800">
                    <span className="absolute bottom-0 right-0 h-2 w-2.5 bg-black/80" />
                </div>
                <p className="mt-1.5 truncate text-[8px] font-bold text-white">Casco</p>
            </div>
            <div className="border border-white/10 bg-black/50 p-2 text-center">
                <div className="mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-stone-500 bg-black">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#F97316]" />
                </div>
                <p className="mt-1.5 truncate text-[8px] font-bold text-white">Cubierta</p>
            </div>
            <div className="border border-white/10 bg-black/50 p-2 text-center">
                <div className="relative mx-auto mt-1 h-8 w-5 border border-orange-300/40 bg-gradient-to-b from-orange-400/70 to-orange-900/60">
                    <span className="absolute -top-1 left-1/2 h-1.5 w-2.5 -translate-x-1/2 bg-stone-500" />
                </div>
                <p className="mt-1.5 truncate text-[8px] font-bold text-white">Aceite</p>
            </div>
        </div>
        <div className="px-5 pb-5">
            <a
                href={wa.href}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`portfolio-mock-button-${wa.id}`}
                className="block w-full rounded-sm bg-[#F97316] py-2 text-center text-[10px] font-extrabold uppercase tracking-widest text-black shadow-[0_4px_0_#7C2D12]"
            >
                {wa.label}
            </a>
        </div>
    </div>
);

const FotografiaMockup = ({ wa }) => (
    <div className="relative flex h-full flex-col items-center justify-center bg-black px-6 text-center">
        <span className="absolute left-6 top-6 h-6 w-6 border-l border-t border-white/30" />
        <span className="absolute right-6 top-6 h-6 w-6 border-r border-t border-white/30" />
        <span className="absolute bottom-6 left-6 h-6 w-6 border-b border-l border-white/30" />
        <span className="absolute bottom-6 right-6 h-6 w-6 border-b border-r border-white/30" />
        <p className="font-mono text-[8px] uppercase tracking-[0.5em] text-white/50">
            Bodas · 15 años · Eventos
        </p>
        <p className="mt-3 text-lg font-extralight uppercase tracking-[0.35em] text-white sm:text-xl">
            Fotografía PY
        </p>
        <span className="mt-4 h-px w-14 bg-white/40" />
        <a
            href={wa.href}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={`portfolio-mock-button-${wa.id}`}
            className="mt-5 rounded-full border border-white/60 px-5 py-1.5 text-[9px] uppercase tracking-[0.25em] text-white transition-colors duration-300 hover:bg-white hover:text-black"
        >
            {wa.label}
        </a>
    </div>
);

const PROJECTS = [
    {
        id: "cellshop",
        title: "Cell Shop PY",
        desc: "Venta de celulares con catálogo iPhone y Samsung y cotización directa por WhatsApp.",
        tags: ["E-commerce", "Catálogo", "Ventas"],
        url: "cellshoppy.webcreatorpy.com",
        Mockup: CellShopMockup,
        wa: { label: "Cotizar por WhatsApp", text: "Hola quiero cotizar un celular" },
    },
    {
        id: "motorepuestos",
        title: "Moto Repuestos CDE",
        desc: "Repuestos para motos con estilo industrial rudo y consulta de stock al instante.",
        tags: ["Tienda", "Stock", "Industrial"],
        url: "motorepuestoscde.webcreatorpy.com",
        Mockup: MotoMockup,
        wa: { label: "Consultar Stock", text: "Hola quiero consultar stock de repuestos" },
    },
    {
        id: "fotografia",
        title: "Fotografía PY",
        desc: "Galería minimalista en blanco y negro para bodas, 15 años y eventos.",
        tags: ["Bodas", "15 años", "Eventos"],
        url: "fotografiapy.webcreatorpy.com",
        Mockup: FotografiaMockup,
        wa: { label: "Reservar Sesión", text: "Hola quiero reservar una sesión de fotos" },
    },
];

export default function Portfolio() {
    const [works, setWorks] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/portfolio`)
            .then((r) => r.json())
            .then((d) => setWorks(Array.isArray(d) ? d : []))
            .catch(() => {});
    }, []);

    return (
        <section id="portafolio" className="relative z-10 py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-6">
                <SectionHeader
                    id="portafolio"
                    eyebrow="// Portafolio"
                    title="Demos que ya convierten"
                    sub="Tres estilos distintos, un mismo sello: rápido, elegante y listo para vender."
                />

                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={viewport}
                    className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                >
                    {PROJECTS.map((p) => (
                        <motion.article
                            key={p.id}
                            variants={fadeUp}
                            data-testid={`portfolio-card-${p.id}`}
                            className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink/70 transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-2 hover:border-neon/50 hover:shadow-[0_0_60px_rgba(0,255,170,0.14)]"
                        >
                            <div className="relative">
                                <BrowserBar url={p.url} />
                                <div
                                    className="h-64 origin-top transition-transform duration-700 group-hover:scale-[1.02]"
                                    style={{ perspective: "900px" }}
                                >
                                    <p.Mockup wa={{ id: p.id, label: p.wa.label, href: waLink(p.wa.text) }} />
                                </div>
                                <a
                                    data-testid={`portfolio-demo-${p.id}`}
                                    href={waLink(`Hola vi WebCreatorPY y quiero un sitio como ${p.title}`)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 top-[42px] flex items-center justify-center bg-obsidian/70 opacity-0 backdrop-blur-[2px] transition-opacity duration-400 hover:opacity-100 focus-visible:opacity-100"
                                    aria-label={`Ver ${p.title} — escribir por WhatsApp`}
                                >
                                    <span className="inline-flex items-center gap-2 rounded-full border border-neon/60 bg-obsidian/80 px-6 py-3 text-sm font-semibold text-neon shadow-[0_0_30px_rgba(0,255,170,0.3)]">
                                        Quiero algo así
                                        <ArrowUpRight size={16} />
                                    </span>
                                </a>
                            </div>
                            <div className="flex flex-1 flex-col p-6">
                                <h3 className="font-display text-base font-semibold text-white">
                                    {p.title}
                                </h3>
                                <p className="mt-1 text-sm text-slate-400">{p.desc}</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {p.tags.map((t) => (
                                        <span
                                            key={t}
                                            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-slate-400"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.article>
                    ))}
                    {works.map((w, i) => (
                        <motion.article
                            key={w.id}
                            variants={fadeUp}
                            data-testid={`portfolio-work-card-${i}`}
                            className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink/70 transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-2 hover:border-neon/50 hover:shadow-[0_0_60px_rgba(0,255,170,0.14)]"
                        >
                            <div className="relative">
                                <BrowserBar url={w.link || `${String(w.title || "proyecto").toLowerCase().replace(/\s+/g, "")}.webcreatorpy.com`} />
                                {w.image ? (
                                    <img src={w.image} alt={w.title} className="h-64 w-full object-cover" />
                                ) : (
                                    <div className="flex h-64 items-center justify-center bg-ink">
                                        <span className="font-display text-3xl font-bold text-neon/30">
                                            {String(w.title || "").slice(0, 2).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <span className="absolute left-4 top-14 rounded-full border border-neon/40 bg-obsidian/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-neon backdrop-blur-sm">
                                    {w.type}
                                </span>
                            </div>
                            <div className="flex flex-1 flex-col p-6">
                                <h3 className="font-display text-base font-semibold text-white">{w.title}</h3>
                                <p className="mt-1 text-sm text-slate-400">{w.description}</p>
                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                    <span className="rounded-full border border-neon/40 bg-neon/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-neon">
                                        Plan Gs. {Number(w.price).toLocaleString("es-PY")}
                                    </span>
                                    {w.link && (
                                        <a
                                            data-testid={`portfolio-work-link-${i}`}
                                            href={w.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-slate-400 transition-colors duration-200 hover:border-neon/40 hover:text-neon"
                                        >
                                            Visitar sitio
                                            <ExternalLink size={11} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
