import { motion } from "framer-motion";
import { fadeUp, stagger, viewport } from "@/lib/motion";

export default function SectionHeader({ eyebrow, title, sub, id }) {
    return (
        <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className="mx-auto max-w-3xl text-center"
            data-testid={`section-header-${id}`}
        >
            <motion.p
                variants={fadeUp}
                className="font-mono text-xs uppercase tracking-[0.35em] text-neon"
            >
                {eyebrow}
            </motion.p>
            <motion.h2
                variants={fadeUp}
                className="mt-4 font-display text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl"
            >
                {title}
            </motion.h2>
            {sub && (
                <motion.p
                    variants={fadeUp}
                    className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg"
                >
                    {sub}
                </motion.p>
            )}
        </motion.div>
    );
}
