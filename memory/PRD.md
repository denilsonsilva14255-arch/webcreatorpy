# PRD — WEB CREATOR PY

## Original Problem Statement
Create an ultra premium dark tech agency website for WEB CREATOR PY, tagline "TU IDEA, NUESTRA CREACION", Paraguay. Requested stack: Next.js 14 + Tailwind + Framer Motion + TypeScript, frontend only. Exact design spec: #05070A background with fixed MatrixRain canvas (chars 01WEBPY, #00FFAA, opacity 0.15, mono 14px, trail rgba(5,7,10,0.1)), glassmorphism navbar with glowing diamond logo, typewriter hero with cyan gradient + 3D floating laptop, 3 service cards, 2 portfolio cards (Mariachis Demo, Fotografo Demo), pricing ($299/$599/$999+), floating WhatsApp pulse button, footer with Síguenos socials, chatbot bubble with quick replies, Framer Motion scroll reveals, Stripe/Linear premium level.

## User Decisions (via ask_human)
- Stack: React (CRA) + Tailwind + Framer Motion (platform preview cannot serve Next.js) — pixel-identical design.
- Portfolio visuals: CSS-built website mockups.
- Extras: stats bar approved. Brand data: WA +595 971 758 226 (wa.me/595971758226), IG/FB @webcreatorpy (real URLs with tracking params in site.js), contacto@webcreatorpy.com, Asunción PY, Spanish, colors #05070A / #00FFAA / #10B981.

## Architecture
- React 19 (CRA + craco) SPA, no router (single page, anchor navigation via Lenis smooth scroll), frontend-only.
- src/lib/site.js — WhatsApp/IG/FB/email constants + waLink() + scrollToSection().
- src/lib/motion.js — shared framer-motion reveal variants.
- Components: MatrixRain (canvas), Navbar (glass), Hero (typewriter + CSS 3D laptop w/ mouse tilt + scroll parallax), Marquee, Services, Portfolio (2 CSS mockups), Nosotros (+terminal card + stats bar with count-up), Pricing, Contact, Footer, WhatsAppButton (pulse), Chatbot (quick replies → WhatsApp), WhatsAppGlyph, ErrorBoundary.
- SEO: es lang, meta/OG/Twitter, JSON-LD ProfessionalService, favicon.svg diamond mark.

## Implemented (2026-10-08)
All 10 spec points + stats bar + editorial marquee + Lenis smooth scroll + noise/grain overlay + JSON-LD + custom favicon. All interactive elements carry data-testid.

## Sample/Placeholder Data
- Stats figures (+50 proyectos, 99.8%, 3.5x) are illustrative marketing numbers — adjust to real data when available.
- Portfolio demos are fictional demo mockups (as user requested "Demo" cards).

## Update 2 (2026-10-08)
- Real contact info everywhere: WA 0971758226 (wa.me/595971758226), IG/FB real URLs, email webcreatorpy99@gmail.com (site.js + JSON-LD + footer display).
- Portfolio: 3 demos, no prices, distinct styles — Cell Shop PY (light theme), Moto Repuestos CDE (orange/black industrial), Fotografía PY (elegant B&W). Mockup buttons deep-link to WhatsApp.
- Pricing: Plan Emprendedor Gs. 800.000 / Plan Negocio Gs. 1.700.000 (Más Popular, badge #00FF41, borde celeste) / Plan Premium Gs. 2.850.000 — precios grandes blancos en guaraníes, botones "Solicitar Presupuesto Gratis" → wa.me/595971758226?text=Hola%20quiero%20presupuesto%20gratis, nota "Presupuesto gratis en 24hs por WhatsApp".

## Phase 2 (2026-10-08) — Backend, Admin, Real AI Chatbot
- Backend: FastAPI + MongoDB (MONGO_URL/DB_NAME). Collections: leads, chats, visits. Routes: POST /api/visits, POST /api/leads, GET /api/leads (admin), PATCH /api/leads/{id}/contacted, POST /api/chat (SSE streaming via emergentintegrations LlmChat, model openai/gpt-5.4, EMERGENT_LLM_KEY), GET /api/chat/{session_id}, POST /api/admin/login (HMAC token), GET /api/admin/stats, GET /api/admin/export (CSV), GET /api/admin/chats. Lead auto-extraction by regex (phone/name/email/business) from chat messages, one lead per session.
- AI chatbot: bubble bottom-left (Bot icon), premium dark chat window, streaming replies, session persistence, fallback to WhatsApp/email on error. System prompt sells webs, offers presupuesto gratis en 24hs.
- Admin panel: /admin password-gated (ADMIN_PASSWORD env, default WebcreatorPy@1999). Dashboard: stats cards, leads table with mark-contacted, CSV export, expandable chat history.
- Frontend: react-router added (SPA routes / and /admin); Lenis + visit tracker (POST /api/visits once per session) inside Router.
- Credentials: /app/memory/test_credentials.md (admin password WebcreatorPy@1999).
- Matrix rain color rotation: cycles muted pastels blue #3A8FB7 → red #B73A4A → purple #7A5AB7 → green #3AB77A, 6s per color with 1.5s smoothstep fade, infinite loop (MatrixRain.js rainColorAt()). Tuned (user request): opacity 0.20, shadowBlur 4, density 10px columns, font 18px.

## Phase 3 (2026-10-09) — Portfolio Manager
- Backend: collection `portfolio`; routes GET /api/portfolio (public), POST/PUT/DELETE /api/portfolio/{id} (admin, multipart, imagen hasta 3MB guardada como base64 en el doc).
- Admin: menú lateral (Dashboard / Portfolio), sección Portfolio con "+ Agregar Trabajo", formulario (título, tipo Landing/Negocio/E-commerce, descripción 1 línea, imagen de portada, link opcional, precio 800.000/1.700.000/2.850.000), grilla con Editar/Eliminar.
- Web principal: los trabajos subidos aparecen automáticamente en la sección Portafolio (junto a las 3 demos CSS) con precio en Gs. y link opcional.

## Fase Sofi (2026-10-10) — Rebrand del chatbot
- Asesora virtual "Sofi" con 3 modos: PORTERO (hola/info → pregunta solo modelo + rubro), AVISADOR (nudge local a los 15s de inactividad o al cerrar el chat: "¿Te armo un presupuesto a tu medida sin compromiso? 👈"), ENCICLOPEDIA Y CERRADORA (Landing/Catálogo/Tienda/A medida; todo incluye diseño, dominio .com/.com.py, hosting 1 año, conexión WhatsApp, entrega 3-7 días).
- REGLA DE ORO precios: nunca da precio fijo; siempre línea de presupuesto a medida. REGLA DE ORO cierre: al final de cada respuesta MODO 3 genera link wa.me/595971758226 con el pedido URL-encoded (markdown → se renderiza como botón clicable en el chat; RenderContent linkifica markdown + URLs).
- Privacidad y contacto oficial (595994388777 / 595971758226) se mantienen.

## Backlog (P0/P1/P2)
- P1: Backend contact form (FastAPI) + real lead storage.
- P1: Real portfolio case studies w/ images + live demo links.
- P2: Blog/SEO content pages, i18n EN, Google Analytics, testimonial strip.
