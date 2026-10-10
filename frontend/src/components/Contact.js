import { motion } from "framer-motion";
import { MessageCircle, Mail, MapPin } from "lucide-react";
import { waLink, WA_DEFAULT_LINK, EMAIL } from "@/lib/site";
import { fadeUp, stagger, viewport } from "@/lib/motion";

export default function Contact() {
    return (
        <section id="contacto" className="relative z-10 py-24 lg:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={viewport}
                    data-testid="contact-panel"
                    className="grid-lines relative overflow-hidden rounded-3xl border border-neon/20 bg-ink/70 px-8 py-16 text-center backdrop-blur-sm sm:px-16"
                >
                    <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[560px] -translate-x-1/2 rounded-full bg-neon/10 blur-[90px]" />

                    <motion.p
                        variants={fadeUp}
                        className="font-mono text-xs uppercase tracking-[0.35em] text-neon"
                    >
                        // Contacto
                    </motion.p>
                    <motion.h2
                        variants={fadeUp}
                        className="mt-4 font-display text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl"
                    >
                        ¿Listo para crear tu web?
                    </motion.h2>
                    <motion.p
                        variants={fadeUp}
                        className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg"
                    >
                        Cuéntanos tu idea y la convertimos en tu próxima web.
                        Cotización sin compromiso.
                    </motion.p>

                    <motion.div
                        variants={fadeUp}
                        className="mt-10 flex flex-wrap items-center justify-center gap-4"
                    >
                        <a
                            data-testid="contact-whatsapp-button"
                            href={WA_DEFAULT_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-bold text-obsidian shadow-[0_0_35px_rgba(37,211,102,0.35)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_55px_rgba(37,211,102,0.5)]"
                        >
                            <MessageCircle size={17} />
                            Escribir por WhatsApp
                        </a>
                        <a
                            data-testid="contact-email-button"
                            href={`mailto:${EMAIL}`}
                            className="glass inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-slate-200 transition-[border-color,box-shadow,color,transform] duration-300 hover:-translate-y-0.5 hover:border-neon/50 hover:text-neon"
                        >
                            <Mail size={17} />
                            {EMAIL}
                        </a>
                    </motion.div>

                    <motion.p
                        variants={fadeUp}
                        className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500"
                    >
                        <MapPin size={13} className="text-neon" />
                        Asunción, Paraguay — GMT-3
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
}
