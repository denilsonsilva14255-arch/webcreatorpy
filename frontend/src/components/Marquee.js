const ITEMS = [
    "Desarrollo Web",
    "Automatización IA",
    "Diseño UI/UX",
    "Next.js",
    "E-commerce",
    "Chatbots WhatsApp",
    "SEO Técnico",
    "Asunción, PY",
];

const Row = ({ ariaHidden = false }) => (
    <div aria-hidden={ariaHidden} className="flex shrink-0 items-center">
        {ITEMS.map((item) => (
            <span key={item} className="flex items-center">
                <span className="whitespace-nowrap px-8 font-mono text-xs uppercase tracking-[0.35em] text-slate-500 sm:text-sm">
                    {item}
                </span>
                <span className="h-1.5 w-1.5 rotate-45 bg-neon/50" />
            </span>
        ))}
    </div>
);

export default function Marquee() {
    return (
        <div
            data-testid="marquee"
            className="relative z-10 overflow-hidden border-y border-white/5 bg-white/[0.02] py-5"
        >
            <div className="flex w-max animate-marquee">
                <Row />
                <Row ariaHidden />
            </div>
        </div>
    );
}
