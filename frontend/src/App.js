import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import ErrorBoundary from "@/components/ErrorBoundary";
import MatrixRain from "@/components/MatrixRain";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Nosotros from "@/components/Nosotros";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Chatbot from "@/components/Chatbot";
import AdminPage from "@/components/AdminPage";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function LenisInit() {
    const { pathname } = useLocation();
    useEffect(() => {
        if (pathname.startsWith("/admin")) return;
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
        const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
        window.__lenis = lenis;
        let raf;
        const loop = (time) => {
            lenis.raf(time);
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(raf);
            lenis.destroy();
            window.__lenis = null;
        };
    }, [pathname]);
    return null;
}

function VisitTracker() {
    useEffect(() => {
        if (sessionStorage.getItem("wcpy_visit")) return;
        sessionStorage.setItem("wcpy_visit", "1");
        fetch(`${API}/visits`, { method: "POST" }).catch(() => {});
    }, []);
    return null;
}

function Site() {
    return (
        <div className="relative min-h-screen bg-obsidian font-sans text-slate-100">
            <div className="noise" aria-hidden="true" />
            <MatrixRain />
            <Navbar />
            <main className="relative z-10">
                <Hero />
                <Marquee />
                <Services />
                <Portfolio />
                <Nosotros />
                <Pricing />
                <Contact />
            </main>
            <Footer />
            <WhatsAppButton />
            <Chatbot />
        </div>
    );
}

function App() {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <LenisInit />
                <VisitTracker />
                <Routes>
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="*" element={<Site />} />
                </Routes>
            </BrowserRouter>
        </ErrorBoundary>
    );
}

export default App;
