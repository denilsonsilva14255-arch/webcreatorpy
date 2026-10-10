import { Instagram, Facebook, Mail, MapPin, MessageCircle } from "lucide-react";
import { DiamondMark } from "@/components/Navbar";
import {
    INSTAGRAM_URL,
    FACEBOOK_URL,
    WA_DEFAULT_LINK,
    EMAIL,
    scrollToSection,
} from "@/lib/site";

const LINKS = [
    { id: "inicio", label: "Inicio" },
    { id: "servicios", label: "Servicios" },
    { id: "portafolio", label: "Portafolio" },
    { id: "nosotros", label: "Nosotros" },
    { id: "contacto", label: "Contacto" },
];

const SOCIALS = [
    { id: "instagram", label: "Instagram", href: INSTAGRAM_URL, Icon: Instagram },
    { id: "facebook", label: "Facebook", href: FACEBOOK_URL, Icon: Facebook },
    { id: "whatsapp", label: "WhatsApp", href: WA_DEFAULT_LINK, Icon: MessageCircle },
];

export default function Footer() {
    return (
        <footer className="relative z-10 border-t border-white/5 bg-obsidian/80 backdrop-blur-sm">
            <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                    <div className="flex items-center gap-3">
                        <DiamondMark className="h-8 w-8 drop-shadow-[0_0_10px_rgba(0,255,170,0.5)]" />
                        <span className="font-display text-sm font-bold tracking-widest text-white">
                            WEB CREATOR <span className="text-neon">PY</span>
                        </span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-slate-400">
                        Tu idea, nuestra creación. Desarrollo web y automatización
                        con IA en Paraguay.
                    </p>
                </div>

                <div>
                    <h4 className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500">
                        Navegación
                    </h4>
                    <ul className="mt-5 space-y-3">
                        {LINKS.map((l) => (
                            <li key={l.id}>
                                <button
                                    data-testid={`footer-link-${l.id}`}
                                    onClick={() => scrollToSection(l.id)}
                                    className="text-sm text-slate-400 transition-colors duration-200 hover:text-neon"
                                >
                                    {l.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500">
                        Síguenos
                    </h4>
                    <ul className="mt-5 space-y-3">
                        {SOCIALS.map(({ id, label, href, Icon }) => (
                            <li key={id}>
                                <a
                                    data-testid={`footer-social-${id}`}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-3 text-sm text-slate-400 transition-colors duration-200 hover:text-neon"
                                >
                                    <span className="rounded-lg border border-white/10 p-2 transition-[border-color,box-shadow] duration-300 group-hover:border-neon/50 group-hover:shadow-[0_0_18px_rgba(0,255,170,0.2)]">
                                        <Icon size={15} />
                                    </span>
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500">
                        Contacto
                    </h4>
                    <ul className="mt-5 space-y-3 text-sm text-slate-400">
                        <li>
                            <a
                                data-testid="footer-email"
                                href={`mailto:${EMAIL}`}
                                className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-neon"
                            >
                                <Mail size={15} className="text-neon" />
                                {EMAIL}
                            </a>
                        </li>
                        <li>
                            <a
                                data-testid="footer-phone"
                                href={WA_DEFAULT_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-neon"
                            >
                                <MessageCircle size={15} className="text-neon" />
                                WhatsApp: 0971758226
                            </a>
                        </li>
                        <li className="inline-flex items-center gap-2">
                            <MapPin size={15} className="text-neon" />
                            Asunción, Paraguay
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/5">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-6">
                    <p className="text-xs text-slate-500" data-testid="footer-copyright">
                        © {new Date().getFullYear()} WEB CREATOR PY — Todos los derechos reservados
                    </p>
                    <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500">
                        Hecho en Paraguay
                        <span className="h-1.5 w-1.5 rotate-45 bg-neon/60" />
                    </p>
                </div>
            </div>
        </footer>
    );
}
