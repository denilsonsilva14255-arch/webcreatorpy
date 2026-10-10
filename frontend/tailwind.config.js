/** @type {import('tailwindcss').Config} */
module.exports = {
    blocklist: ["overline"],
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    theme: {
        extend: {
            colors: {
                obsidian: "#05070A",
                ink: "#0B0F17",
                panel: "#0A0E17",
                slatecard: "#0F172A",
                neon: "#00FFAA",
                "neon-dim": "rgba(0, 255, 170, 0.15)",
            },
            fontFamily: {
                display: ["Unbounded", "sans-serif"],
                sans: ["Sora", "sans-serif"],
                mono: ["'JetBrains Mono'", "monospace"],
            },
            boxShadow: {
                "neon-sm": "0 0 20px rgba(0, 255, 170, 0.18)",
                "neon-lg": "0 0 60px rgba(0, 255, 170, 0.22)",
            },
            keyframes: {
                blink: {
                    "0%, 49%": { opacity: "1" },
                    "50%, 100%": { opacity: "0" },
                },
                marquee: {
                    from: { transform: "translateX(0)" },
                    to: { transform: "translateX(-50%)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(-6px)" },
                    "50%": { transform: "translateY(8px)" },
                },
                "pulse-ring": {
                    "0%": { transform: "scale(1)", opacity: "0.55" },
                    "100%": { transform: "scale(1.9)", opacity: "0" },
                },
                "bar-grow": {
                    "0%, 100%": { transform: "scaleY(0.45)" },
                    "50%": { transform: "scaleY(1)" },
                },
            },
            animation: {
                blink: "blink 1.1s step-end infinite",
                marquee: "marquee 48s linear infinite",
                float: "float 7s ease-in-out infinite",
                "pulse-ring": "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "bar-grow": "bar-grow 2.6s ease-in-out infinite",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
