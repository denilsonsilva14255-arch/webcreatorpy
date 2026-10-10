import { WhatsAppGlyph } from "@/components/WhatsAppGlyph";
import { WA_DEFAULT_LINK } from "@/lib/site";

export default function WhatsAppButton() {
    return (
        <a
            data-testid="whatsapp-float-button"
            href={WA_DEFAULT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escríbenos por WhatsApp"
            className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_0_30px_rgba(37,211,102,0.45)] transition-transform duration-300 hover:scale-110 sm:h-16 sm:w-16"
        >
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#25D366]/45" />
            <span
                className="absolute inset-0 animate-pulse-ring rounded-full bg-[#25D366]/30"
                style={{ animationDelay: "1s" }}
            />
            <WhatsAppGlyph size={28} />
            <span className="glass pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium text-slate-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                ¿Hablamos?
            </span>
        </a>
    );
}
