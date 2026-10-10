import { useEffect, useRef } from "react";

const CHARS = "01WEBPY".split("");
const FONT_SIZE = 18;
const COLUMN_W = 7;
const TICK_MS = 70;

// Rotación de color: azul -> rojo -> púrpura -> verde, 6s por color, fade suave de 1.5s, loop infinito
const RAIN_COLORS = [
    [58, 143, 183],  // #3A8FB7 azul pastel
    [183, 58, 74],   // #B73A4A rojo muted
    [122, 90, 183],  // #7A5AB7 púrpura pastel
    [58, 183, 122],  // #3AB77A verde pastel
];
const SEGMENT_MS = 6000;
const FADE_MS = 1500;
const HOLD_RATIO = (SEGMENT_MS - FADE_MS) / SEGMENT_MS;

function rainColorAt(t) {
    const cycle = RAIN_COLORS.length * SEGMENT_MS;
    const pos = (t % cycle) / SEGMENT_MS;
    const idx = Math.floor(pos) % RAIN_COLORS.length;
    const local = pos - Math.floor(pos);
    const a = RAIN_COLORS[idx];
    const b = RAIN_COLORS[(idx + 1) % RAIN_COLORS.length];
    let f = 0;
    if (local > HOLD_RATIO) f = (local - HOLD_RATIO) / (1 - HOLD_RATIO);
    const ease = f * f * (3 - 2 * f);
    const mix = (i) => Math.round(a[i] + (b[i] - a[i]) * ease);
    return [mix(0), mix(1), mix(2)];
}

export default function MatrixRain() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let raf;
        let last = 0;
        let drops = [];

        const resize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.fillStyle = "#05070A";
            ctx.fillRect(0, 0, w, h);
            const cols = Math.ceil(w / COLUMN_W);
            drops = Array.from({ length: cols }, () => ({
                y: Math.floor(Math.random() * -60),
                v: 0.55 + Math.random() * 0.5,
            }));
        };

        resize();
        window.addEventListener("resize", resize);

        const draw = (t) => {
            raf = requestAnimationFrame(draw);
            if (t - last < TICK_MS) return;
            last = t;
            const w = window.innerWidth;
            const h = window.innerHeight;
            ctx.fillStyle = "rgba(5, 7, 10, 0.1)";
            ctx.fillRect(0, 0, w, h);
            ctx.font = "18px 'JetBrains Mono', monospace";
            ctx.textBaseline = "top";
            const [cr, cg, cb] = rainColorAt(t);
            ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, 0.2)`;
            ctx.shadowColor = `rgba(${cr}, ${cg}, ${cb}, 0.45)`;
            ctx.shadowBlur = 4;
            for (let i = 0; i < drops.length; i++) {
                const d = drops[i];
                const char = CHARS[(Math.random() * CHARS.length) | 0];
                ctx.fillText(char, i * COLUMN_W, d.y * FONT_SIZE);
                d.y += d.v;
                if (d.y * FONT_SIZE > h && Math.random() > 0.975) {
                    d.y = Math.floor(Math.random() * -40);
                }
            }
        };

        raf = requestAnimationFrame(draw);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            data-testid="matrix-rain-canvas"
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0"
        />
    );
}
