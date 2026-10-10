import { useEffect, useState } from "react";
import {
    Bot, Eye, Users, MessagesSquare, LogOut, Download, Check, Lock, ArrowLeft, ChevronDown,
    LayoutDashboard, Images, Plus, Pencil, Trash2, X, ExternalLink,
} from "lucide-react";
import { DiamondMark } from "@/components/Navbar";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const fmtDate = (iso) => {
    try {
        return new Date(iso).toLocaleString("es-PY", { dateStyle: "short", timeStyle: "short" });
    } catch {
        return iso;
    }
};

const PRICE_OPTIONS = [
    { value: "800000", label: "Gs. 800.000" },
    { value: "1700000", label: "Gs. 1.700.000" },
    { value: "2850000", label: "Gs. 2.850.000" },
];

const priceLabel = (v) => (PRICE_OPTIONS.find((p) => p.value === String(v)) || {}).label || v;

function PortfolioAdmin({ token }) {
    const [works, setWorks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ title: "", type: "Landing", description: "", link: "", price: "800000" });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [busy, setBusy] = useState(false);

    const load = () =>
        fetch(`${API}/portfolio`)
            .then((r) => r.json())
            .then((d) => setWorks(Array.isArray(d) ? d : []))
            .catch(() => {});

    useEffect(() => {
        load();
    }, []);

    const openForm = () => {
        setEditingId(null);
        setForm({ title: "", type: "Landing", description: "", link: "", price: "800000" });
        setFile(null);
        setPreview("");
        setShowForm(true);
    };

    const editWork = (w) => {
        setEditingId(w.id);
        setForm({
            title: w.title || "",
            type: w.type || "Landing",
            description: w.description || "",
            link: w.link || "",
            price: String(w.price || "800000"),
        });
        setFile(null);
        setPreview(w.image || "");
        setShowForm(true);
    };

    const onFile = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const submit = async () => {
        if (!form.title.trim() || !form.description.trim() || (!editingId && !file)) return;
        setBusy(true);
        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("type", form.type);
        fd.append("description", form.description);
        fd.append("link", form.link);
        fd.append("price", form.price);
        if (file) fd.append("file", file);
        const res = await fetch(editingId ? `${API}/portfolio/${editingId}` : `${API}/portfolio`, {
            method: editingId ? "PUT" : "POST",
            headers: { Authorization: token },
            body: fd,
        });
        setBusy(false);
        if (res.ok) {
            setShowForm(false);
            load();
        }
    };

    const remove = async (id) => {
        await fetch(`${API}/portfolio/${id}`, { method: "DELETE", headers: { Authorization: token } });
        load();
    };

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="font-display text-lg font-bold text-white">
                    Portfolio <span className="text-neon">— Trabajos</span>
                </h2>
                <button
                    data-testid="admin-add-work"
                    onClick={openForm}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-neon to-emerald-500 px-5 py-2.5 text-sm font-bold text-obsidian shadow-[0_0_25px_rgba(0,255,170,0.3)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5"
                >
                    <Plus size={16} /> Agregar Trabajo
                </button>
            </div>

            {showForm && (
                <div data-testid="admin-work-form" className="mt-6 rounded-2xl border border-neon/25 bg-ink/80 p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                            {editingId ? "Editar trabajo" : "Nuevo trabajo"}
                        </h3>
                        <button
                            data-testid="admin-work-close-form"
                            onClick={() => setShowForm(false)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
                            aria-label="Cerrar formulario"
                        >
                            <X size={17} />
                        </button>
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <input
                            data-testid="admin-work-title"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="Título del proyecto"
                            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-neon/50"
                        />
                        <select
                            data-testid="admin-work-type"
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none focus:border-neon/50"
                        >
                            <option value="Landing">Landing</option>
                            <option value="Negocio">Negocio</option>
                            <option value="E-commerce">E-commerce</option>
                        </select>
                        <input
                            data-testid="admin-work-link"
                            value={form.link}
                            onChange={(e) => setForm({ ...form, link: e.target.value })}
                            placeholder="Link de la web (opcional)"
                            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-neon/50"
                        />
                        <select
                            data-testid="admin-work-price"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none focus:border-neon/50"
                        >
                            {PRICE_OPTIONS.map((p) => (
                                <option key={p.value} value={p.value}>{p.label}</option>
                            ))}
                        </select>
                        <input
                            data-testid="admin-work-description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Descripción corta (1 línea)"
                            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-neon/50 sm:col-span-2"
                        />
                        <div className="sm:col-span-2">
                            <label
                                data-testid="admin-work-file"
                                className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/20 bg-white/[0.02] px-4 py-4 text-sm text-slate-400 transition-[border-color] duration-200 hover:border-neon/50 hover:text-neon"
                            >
                                <Images size={18} className="text-neon" />
                                {file ? file.name : "Imagen de portada — subir archivo"}
                                <input type="file" accept="image/*" className="hidden" onChange={onFile} />
                            </label>
                            {preview && (
                                <img src={preview} alt="Vista previa" className="mt-3 h-36 w-full rounded-xl object-cover" />
                            )}
                        </div>
                    </div>
                    <div className="mt-5 flex gap-3">
                        <button
                            data-testid="admin-work-save"
                            onClick={submit}
                            disabled={busy || !form.title.trim() || !form.description.trim() || (!editingId && !file)}
                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-neon to-emerald-500 px-6 py-2.5 text-sm font-bold text-obsidian disabled:opacity-40"
                        >
                            <Check size={15} /> {editingId ? "Guardar cambios" : "Guardar trabajo"}
                        </button>
                        <button
                            data-testid="admin-work-cancel"
                            onClick={() => setShowForm(false)}
                            className="rounded-full border border-white/10 px-6 py-2.5 text-sm text-slate-300 hover:border-white/30"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="admin-works-grid">
                {works.length === 0 && (
                    <p className="col-span-full rounded-2xl border border-white/10 bg-ink/60 px-6 py-10 text-center text-sm text-slate-500">
                        Todavía no hay trabajos. Toca "+ Agregar Trabajo" para publicar el primero — aparecerá
                        automáticamente en el portafolio de la web principal.
                    </p>
                )}
                {works.map((w, i) => (
                    <div
                        key={w.id}
                        data-testid={`admin-work-card-${i}`}
                        className="overflow-hidden rounded-2xl border border-white/10 bg-ink/70 transition-[border-color,box-shadow] duration-300 hover:border-neon/40"
                    >
                        {w.image && <img src={w.image} alt={w.title} className="h-40 w-full object-cover" />}
                        <div className="p-5">
                            <div className="flex items-center justify-between gap-2">
                                <h4 className="truncate font-display text-sm font-semibold text-white">{w.title}</h4>
                                <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-slate-400">
                                    {w.type}
                                </span>
                            </div>
                            <p className="mt-1.5 truncate text-xs text-slate-400">{w.description}</p>
                            <p className="mt-2 font-mono text-xs font-bold text-neon">{priceLabel(w.price)}</p>
                            {w.link && (
                                <a
                                    href={w.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-neon"
                                >
                                    <ExternalLink size={11} /> {w.link}
                                </a>
                            )}
                            <div className="mt-4 flex gap-2">
                                <button
                                    data-testid={`admin-work-edit-${i}`}
                                    onClick={() => editWork(w)}
                                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-neon/40 px-3 py-1.5 text-[11px] font-semibold text-neon transition-[background-color] duration-200 hover:bg-neon/10"
                                >
                                    <Pencil size={12} /> Editar
                                </button>
                                <button
                                    data-testid={`admin-work-delete-${i}`}
                                    onClick={() => remove(w.id)}
                                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-red-500/40 px-3 py-1.5 text-[11px] font-semibold text-red-400 transition-[background-color] duration-200 hover:bg-red-500/10"
                                >
                                    <Trash2 size={12} /> Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function AdminPage() {
    const [section, setSection] = useState("dashboard");
    const [token, setToken] = useState(() => sessionStorage.getItem("wcpy_admin_token") || "");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [stats, setStats] = useState(null);
    const [leads, setLeads] = useState([]);
    const [chats, setChats] = useState([]);
    const [openChat, setOpenChat] = useState(null);

    const load = async (t) => {
        const headers = { "Content-Type": "application/json", Authorization: t };
        const [s, l, c] = await Promise.all([
            fetch(`${API}/admin/stats`, { headers }).then((r) => r.json()),
            fetch(`${API}/leads`, { headers }).then((r) => r.json()),
            fetch(`${API}/admin/chats`, { headers }).then((r) => r.json()),
        ]);
        setStats(s?.visits !== undefined ? s : null);
        setLeads(Array.isArray(l) ? l : []);
        setChats(Array.isArray(c) ? c : []);
    };

    useEffect(() => {
        if (token) load(token).catch(() => setToken(""));
    }, [token]);

    const login = async () => {
        setError("");
        const res = await fetch(`${API}/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });
        if (!res.ok) {
            setError("Contraseña incorrecta");
            return;
        }
        const { token: t } = await res.json();
        sessionStorage.setItem("wcpy_admin_token", t);
        setToken(t);
    };

    const markContacted = async (id) => {
        await fetch(`${API}/leads/${id}/contacted`, {
            method: "PATCH",
            headers: { Authorization: token },
        });
        setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, contacted: true } : l)));
    };

    const exportCsv = async () => {
        const res = await fetch(`${API}/admin/export`, { headers: { Authorization: token } });
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "leads-webcreatorpy.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!token) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-obsidian px-6">
                <div data-testid="admin-login" className="glass w-full max-w-sm rounded-2xl p-8 text-center">
                    <DiamondMark className="mx-auto h-10 w-10 drop-shadow-[0_0_12px_rgba(0,255,170,0.6)]" />
                    <h1 className="mt-4 font-display text-lg font-bold text-white">Admin — WEB CREATOR PY</h1>
                    <p className="mt-1 text-xs text-slate-400">Acceso restringido</p>
                    <div className="mt-6 space-y-3">
                        <input
                            data-testid="admin-login-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && login()}
                            placeholder="Contraseña"
                            className="w-full rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-center text-sm text-white placeholder-slate-500 outline-none focus:border-neon/50"
                        />
                        {error && (
                            <p data-testid="admin-login-error" className="text-xs text-red-400">{error}</p>
                        )}
                        <button
                            data-testid="admin-login-button"
                            onClick={login}
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-neon to-emerald-500 px-6 py-2.5 text-sm font-bold text-obsidian"
                        >
                            <Lock size={15} /> Ingresar
                        </button>
                        <a href="/" data-testid="admin-back-home" className="inline-flex items-center gap-1.5 pt-1 text-xs text-slate-500 hover:text-neon">
                            <ArrowLeft size={13} /> Volver al sitio
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    const NAV = [
        { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
        { id: "portfolio", label: "Portfolio", Icon: Images },
    ];

    const statCards = [
        { id: "visits", label: "Visitas totales", Icon: Eye, value: stats?.visits },
        { id: "leads", label: "Leads capturados", Icon: Users, value: stats?.leads },
        { id: "messages", label: "Mensajes de chat", Icon: MessagesSquare, value: stats?.messages },
    ];

    return (
        <div className="min-h-screen bg-obsidian text-slate-100">
            <div className="mx-auto flex max-w-[1500px]">
                <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/5 p-6 sm:flex">
                    <div className="flex items-center gap-3">
                        <DiamondMark className="h-8 w-8 drop-shadow-[0_0_10px_rgba(0,255,170,0.5)]" />
                        <span className="font-display text-xs font-bold tracking-widest text-white">
                            WEB CREATOR <span className="text-neon">PY</span>
                        </span>
                    </div>
                    <nav className="mt-10 space-y-1" data-testid="admin-sidebar">
                        {NAV.map(({ id, label, Icon }) => (
                            <button
                                key={id}
                                data-testid={`admin-nav-${id}`}
                                onClick={() => setSection(id)}
                                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-[background-color,color,border-color] duration-200 ${
                                    section === id
                                        ? "border border-neon/30 bg-neon/10 text-neon"
                                        : "border border-transparent text-slate-400 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                <Icon size={17} />
                                {label}
                            </button>
                        ))}
                    </nav>
                    <button
                        data-testid="admin-logout"
                        onClick={() => { sessionStorage.removeItem("wcpy_admin_token"); setToken(""); }}
                        className="mt-auto inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-slate-400 transition-colors duration-200 hover:bg-red-500/10 hover:text-red-400"
                    >
                        <LogOut size={16} /> Salir
                    </button>
                </aside>

                <main className="min-w-0 flex-1 p-6 sm:p-10">
                    <div className="mb-6 flex gap-2 sm:hidden">
                        {NAV.map(({ id, label, Icon }) => (
                            <button
                                key={id}
                                data-testid={`admin-nav-mobile-${id}`}
                                onClick={() => setSection(id)}
                                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold ${
                                    section === id ? "border border-neon/30 bg-neon/10 text-neon" : "border border-white/10 text-slate-400"
                                }`}
                            >
                                <Icon size={14} /> {label}
                            </button>
                        ))}
                    </div>

                    {section === "dashboard" ? (
                        <div>
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <DiamondMark className="h-8 w-8 drop-shadow-[0_0_10px_rgba(0,255,170,0.5)]" />
                                    <h1 className="font-display text-lg font-bold text-white">
                                        Admin <span className="text-neon">WEB CREATOR PY</span>
                                    </h1>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        data-testid="admin-export-csv"
                                        onClick={exportCsv}
                                        className="inline-flex items-center gap-2 rounded-full border border-neon/40 px-4 py-2 text-xs font-semibold text-neon transition-[background-color,box-shadow] duration-200 hover:bg-neon/10 hover:shadow-[0_0_20px_rgba(0,255,170,0.2)]"
                                    >
                                        <Download size={14} /> Exportar leads CSV
                                    </button>
                                    <button
                                        data-testid="admin-logout-top"
                                        onClick={() => { sessionStorage.removeItem("wcpy_admin_token"); setToken(""); }}
                                        className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-slate-300 hover:border-red-400/50 hover:text-red-400"
                                    >
                                        <LogOut size={14} /> Salir
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 grid gap-4 sm:grid-cols-3" data-testid="admin-stats">
                                {statCards.map(({ id, label, Icon, value }) => (
                                    <div key={id} data-testid={`admin-stat-${id}`} className="rounded-2xl border border-white/10 bg-ink/70 p-6">
                                        <Icon size={20} className="text-neon" />
                                        <p className="mt-3 font-display text-3xl font-bold text-white">{value ?? "—"}</p>
                                        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-ink/70" data-testid="admin-leads-table">
                                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                                    <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Leads</h2>
                                    <span className="font-mono text-xs text-slate-500">{leads.length} registros</span>
                                </div>
                                {leads.length === 0 ? (
                                    <p className="px-6 py-10 text-center text-sm text-slate-500">
                                        Todavía no hay leads — se guardan automáticamente cuando alguien deja su teléfono o nombre en el chat.
                                    </p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-white/[0.02] font-mono text-[10px] uppercase tracking-widest text-slate-500">
                                                <tr>
                                                    {["Nombre", "Teléfono", "Negocio", "Email", "Fecha", "Estado", ""].map((h) => (
                                                        <th key={h} className="px-6 py-3 font-medium">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {leads.map((l, i) => (
                                                    <tr key={l.id} className="border-t border-white/5 transition-colors duration-200 hover:bg-white/[0.02]">
                                                        <td className="px-6 py-3 font-medium text-white" data-testid={`admin-lead-name-${i}`}>{l.name || "—"}</td>
                                                        <td className="px-6 py-3 text-neon" data-testid={`admin-lead-phone-${i}`}>{l.phone || "—"}</td>
                                                        <td className="px-6 py-3 text-slate-300">{l.business || "—"}</td>
                                                        <td className="px-6 py-3 text-slate-400">{l.email || "—"}</td>
                                                        <td className="px-6 py-3 text-slate-500">{fmtDate(l.created_at)}</td>
                                                        <td className="px-6 py-3">
                                                            {l.contacted ? (
                                                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400" data-testid={`admin-lead-contacted-badge-${i}`}>
                                                                    <Check size={11} /> Contactado
                                                                </span>
                                                            ) : (
                                                                <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400">Pendiente</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-3 text-right">
                                                            {!l.contacted && (
                                                                <button
                                                                    data-testid={`admin-lead-contacted-${i}`}
                                                                    onClick={() => markContacted(l.id)}
                                                                    className="rounded-full border border-neon/40 px-3 py-1 text-[11px] font-semibold text-neon transition-[background-color] duration-200 hover:bg-neon/10"
                                                                >
                                                                    Marcar contactado
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 rounded-2xl border border-white/10 bg-ink/70" data-testid="admin-chats">
                                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                                    <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Historial de chats</h2>
                                    <span className="inline-flex items-center gap-2 font-mono text-xs text-slate-500">
                                        <Bot size={13} className="text-neon" /> {chats.length} conversaciones
                                    </span>
                                </div>
                                {chats.length === 0 ? (
                                    <p className="px-6 py-10 text-center text-sm text-slate-500">Sin conversaciones todavía.</p>
                                ) : (
                                    <div className="divide-y divide-white/5">
                                        {chats.map((c, i) => (
                                            <div key={c.session_id}>
                                                <button
                                                    data-testid={`admin-chat-session-${i}`}
                                                    onClick={() => setOpenChat(openChat === i ? null : i)}
                                                    className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors duration-200 hover:bg-white/[0.02]"
                                                >
                                                    <span className="font-mono text-xs text-slate-400">
                                                        {c.session_id.slice(0, 8)}… · {c.messages.length} mensajes · {fmtDate(c.messages[0]?.ts)}
                                                    </span>
                                                    <ChevronDown size={15} className={`text-neon transition-transform duration-300 ${openChat === i ? "rotate-180" : ""}`} />
                                                </button>
                                                {openChat === i && (
                                                    <div className="space-y-2 px-6 pb-5">
                                                        {c.messages.map((m, j) => (
                                                            <div key={j} className={`max-w-[80%] rounded-xl px-4 py-2 text-xs leading-relaxed ${m.role === "user" ? "ml-auto border border-neon/30 bg-neon/10 text-white" : "border border-white/10 bg-white/[0.04] text-slate-300"}`}>
                                                                <span className="mr-2 font-mono text-[9px] uppercase tracking-widest text-slate-500">{m.role === "user" ? "Cliente" : "IA"}</span>
                                                                {m.content}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <PortfolioAdmin token={token} />
                    )}
                </main>
            </div>
        </div>
    );
}
