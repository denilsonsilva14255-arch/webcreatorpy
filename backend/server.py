from fastapi import FastAPI, APIRouter, HTTPException, Header, Response, File, Form, UploadFile
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone
import os
import re
import uuid
import json
import hmac
import hashlib
import logging
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'WebcreatorPy@1999')

SYSTEM_PROMPT = (
    "Sos 'Sofi', la asesora virtual de Web Creator PY, agencia de desarrollo web y automatización "
    "con IA de Asunción, Paraguay. Usás jerga paraguaya leve, sos breve (máximo 3-4 frases) y "
    "profesional.\n\n"
    "MODO 1 - PORTERO (si el cliente entra y dice solo 'hola' o 'info', o saluda sin pedir nada): "
    "Preguntá máximo 2 cosas: 1) ¿Qué modelo busca? (Landing, Catálogo, Tienda, A medida) "
    "2) ¿Para qué rubro es? No des más detalles todavía.\n\n"
    "MODO 2 - AVISADOR (si el cliente no responde o quiere salir): Decí únicamente: "
    "'¿Te armo un presupuesto a tu medida sin compromiso? 👈' y esperá.\n\n"
    "MODO 3 - ENCICLOPEDIA Y CERRADORA (tu modo principal, cuando el cliente pregunta en serio): "
    "Sabés TODO sobre: Landing, Catálogo, Tienda, Web a Medida. Todo incluye: diseño, dominio "
    "(.com / .com.py), hosting 1 año, conexión WhatsApp y entrega en 3 a 7 días.\n\n"
    "REGLA DE ORO - PRECIOS: NUNCA digas precio fijo (ni montos, ni rangos, ni 'desde'). Siempre "
    "decí: 'Te hacemos el presupuesto acorde a lo que buscas, porque cada proyecto es distinto y "
    "así no pagas de más.'\n\n"
    "REGLA DE ORO - CIERRE: Al FINAL de CADA respuesta en MODO 3, generá SIEMPRE este link de "
    "WhatsApp, cambiando [LO QUE PIDIÓ] por lo que pidió el cliente (URL-encoded, sin corchetes):\n"
    "👉 [Hablar por WhatsApp para mi presupuesto a medida]"
    "(https://wa.me/595971758226?text=Hola%20WebCreator!%20Quiero%20presupuesto%20a%20mi%20medida%20para%20[LO%20QUE%20PIDIO].%20Vengo%20de%20la%20web.)\n"
    "Ejemplo: si pidió 'Tienda Online', el link queda "
    "(https://wa.me/595971758226?text=Hola%20WebCreator!%20Quiero%20presupuesto%20a%20mi%20medida%20para%20Tienda%20Online.%20Vengo%20de%20la%20web.)\n\n"
    "REGLA DE PRIVACIDAD (nunca la rompas):\n"
    "- Nunca repitas, muestres o confirmes el número de teléfono, email, RUC o cualquier dato "
    "personal que el cliente escriba.\n"
    "- Si el cliente te da su número, respondé únicamente: 'Perfecto, ya registré tu contacto ✅' "
    "y NUNCA escribas el número de vuelta.\n\n"
    "Además: nunca digas 'no sé' ni te quedes sin respuesta; si algo no está en tu conocimiento, "
    "ofrecé llevar al cliente a WhatsApp: https://wa.me/595994388777 y https://wa.me/595971758226"
)


def redact_personal(text, user_msg):
    for pattern in (PHONE_RE, EMAIL_RE):
        for m in pattern.finditer(user_msg):
            val = m.group(0).strip()
            if len(val) >= 7:
                text = text.replace(val, "[contacto guardado]")
    return text

PHONE_RE = re.compile(r'(?:\+?595)?\s?0?9\d{7,8}|\b\d{7,10}\b')
EMAIL_RE = re.compile(r'[\w.+-]+@[\w-]+\.[\w.-]+')
NAME_RE = re.compile(
    r'(?:me llamo|mi nombre es|soy)\s+([A-Za-zÁÉÍÓÚÑáéíóúñü]{3,25}(?:\s[A-Za-zÁÉÍÓÚÑáéíóúñü]{3,25})?)',
    re.IGNORECASE,
)
BUSINESS_RE = re.compile(
    r'(?:tengo|tiene|mi negocio es|vendo|ofrezco|quiero una web para)\s+(?:un|una|unos|unas|mi)?\s*([^.,!?\n]{3,40})',
    re.IGNORECASE,
)

app = FastAPI()
api_router = APIRouter(prefix="/api")


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def admin_token():
    return hmac.new(ADMIN_PASSWORD.encode(), b"webcreatorpy-admin", hashlib.sha256).hexdigest()


def require_admin(authorization: str):
    if authorization != admin_token():
        raise HTTPException(status_code=401, detail="No autorizado")


def clean_doc(doc):
    if "_id" in doc:
        doc["id"] = doc.pop("_id")
    return doc


def sse(obj):
    return f"data: {json.dumps(obj, ensure_ascii=False)}\n\n"


class LeadIn(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    business: Optional[str] = None
    email: Optional[str] = None
    source: str = "chatbot"


class ChatIn(BaseModel):
    session_id: Optional[str] = None
    message: str


class AdminLoginIn(BaseModel):
    password: str


@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/visits")
async def track_visit():
    await db.visits.insert_one({"_id": str(uuid.uuid4()), "ts": now_iso()})
    return {"ok": True}


@api_router.post("/leads")
async def create_lead(input: LeadIn):
    doc = {
        "_id": str(uuid.uuid4()),
        **{k: v for k, v in input.model_dump().items() if v},
        "contacted": False,
        "created_at": now_iso(),
    }
    await db.leads.insert_one(doc)
    return {"ok": True, "lead": clean_doc(dict(doc))}


@api_router.get("/leads")
async def get_leads(authorization: str = Header(default="")):
    require_admin(authorization)
    docs = await db.leads.find({}).sort("created_at", -1).to_list(1000)
    return [clean_doc(d) for d in docs]


async def maybe_save_lead(session_id: str, message: str):
    fields = {}
    phone = PHONE_RE.search(message)
    if phone:
        fields["phone"] = phone.group(0).strip()
    email = EMAIL_RE.search(message)
    if email:
        fields["email"] = email.group(0)
    name = NAME_RE.search(message)
    if name:
        fields["name"] = name.group(1).strip().title()
    business = BUSINESS_RE.search(message)
    if business:
        fields["business"] = business.group(1).strip()[:40]
    if not fields:
        return
    existing = await db.leads.find_one({"session_id": session_id})
    if existing:
        await db.leads.update_one({"_id": existing["_id"]}, {"$set": fields})
    else:
        await db.leads.insert_one({
            "_id": str(uuid.uuid4()),
            "session_id": session_id,
            "contacted": False,
            "source": "chatbot",
            "created_at": now_iso(),
            **fields,
        })


@api_router.post("/chat")
async def chat(body: ChatIn):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="EMERGENT_LLM_KEY no configurada")
    session_id = body.session_id or str(uuid.uuid4())
    history = await db.chats.find({"session_id": session_id}, {"_id": 0}).sort("ts", 1).to_list(50)
    await db.chats.insert_one({
        "_id": str(uuid.uuid4()),
        "session_id": session_id,
        "role": "user",
        "content": body.message,
        "ts": now_iso(),
    })
    transcript = "\n".join(
        f"{'Cliente' if m['role'] == 'user' else 'Asistente'}: {m['content']}"
        for m in history[-8:]
    )
    system_message = SYSTEM_PROMPT + (f"\n\nConversación previa:\n{transcript}" if transcript else "")
    llm = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=str(uuid.uuid4()),
        system_message=system_message,
    ).with_model("openai", "gpt-5.4")

    async def gen():
        parts = []
        yield sse({"type": "start", "session_id": session_id})
        try:
            async for ev in llm.stream_message(UserMessage(text=body.message)):
                if isinstance(ev, TextDelta):
                    parts.append(ev.content)
                    yield sse({"type": "delta", "content": ev.content})
                elif isinstance(ev, StreamDone):
                    break
        except Exception as e:
            logger.error(f"LLM error: {e}")
            fallback = (
                "¡Perdón, tuve un problema técnico! Un humano te va a atender ya mismo: "
                "WhatsApp https://wa.me/595971758226 o email webcreatorpy99@gmail.com"
            )
            parts = [fallback]
            yield sse({"type": "delta", "content": fallback})
        reply = redact_personal("".join(parts), body.message)
        if reply != "".join(parts):
            yield sse({"type": "replace", "content": reply})
        await db.chats.insert_one({
            "_id": str(uuid.uuid4()),
            "session_id": session_id,
            "role": "assistant",
            "content": reply,
            "ts": now_iso(),
        })
        await maybe_save_lead(session_id, body.message)
        yield sse({"type": "done"})

    return StreamingResponse(
        gen(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@api_router.get("/chat/{session_id}")
async def chat_history(session_id: str):
    msgs = await db.chats.find({"session_id": session_id}, {"_id": 0}).sort("ts", 1).to_list(200)
    return msgs


@api_router.post("/admin/login")
async def admin_login(body: AdminLoginIn):
    if body.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")
    return {"token": admin_token()}


@api_router.get("/admin/stats")
async def admin_stats(authorization: str = Header(default="")):
    require_admin(authorization)
    return {
        "visits": await db.visits.count_documents({}),
        "leads": await db.leads.count_documents({}),
        "messages": await db.chats.count_documents({}),
        "chat_sessions": len(await db.chats.distinct("session_id")),
    }


@api_router.patch("/leads/{lead_id}/contacted")
async def mark_contacted(lead_id: str, authorization: str = Header(default="")):
    require_admin(authorization)
    result = await db.leads.update_one({"_id": lead_id}, {"$set": {"contacted": True}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead no encontrado")
    return {"ok": True}


@api_router.get("/admin/export")
async def export_csv(authorization: str = Header(default="")):
    require_admin(authorization)
    leads = await db.leads.find({}).sort("created_at", -1).to_list(1000)
    rows = ["nombre,telefono,negocio,email,origen,contactado,fecha"]
    for l in leads:
        vals = [str(l.get(k) or "").replace(",", " ") for k in ("name", "phone", "business", "email", "source")]
        vals.append("si" if l.get("contacted") else "no")
        vals.append(str(l.get("created_at", "")))
        rows.append(",".join(vals))
    csv = "\n".join(rows)
    return Response(
        content=csv,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=leads-webcreatorpy.csv"},
    )


@api_router.get("/admin/chats")
async def admin_chats(authorization: str = Header(default="")):
    require_admin(authorization)
    sessions = await db.chats.distinct("session_id")
    out = []
    for s in sessions[-20:][::-1]:
        msgs = await db.chats.find({"session_id": s}, {"_id": 0}).sort("ts", 1).to_list(100)
        out.append({"session_id": s, "messages": msgs})
    return out


import base64


@api_router.get("/portfolio")
async def get_portfolio():
    docs = await db.portfolio.find({}).sort("created_at", -1).to_list(200)
    return [work_out(d) for d in docs]


def work_out(d):
    return {
        "id": d["_id"],
        "title": d.get("title"),
        "type": d.get("type"),
        "description": d.get("description"),
        "link": d.get("link"),
        "price": d.get("price"),
        "image": f"data:{d.get('image_ct', 'image/jpeg')};base64,{d.get('image_b64', '')}" if d.get("image_b64") else None,
        "created_at": d.get("created_at"),
    }


async def read_work_image(file):
    if file is None:
        return None, None
    data = await file.read()
    if not data:
        return None, None
    if len(data) > 3 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Imagen muy grande (máximo 3MB)")
    if not (file.content_type or "").startswith("image/"):
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen")
    return base64.b64encode(data).decode(), file.content_type


@api_router.post("/portfolio")
async def create_work(
    title: str = Form(...),
    type: str = Form(...),
    description: str = Form(...),
    link: str = Form(""),
    price: str = Form(...),
    file: UploadFile = File(...),
    authorization: str = Header(default=""),
):
    require_admin(authorization)
    image_b64, image_ct = await read_work_image(file)
    doc = {
        "_id": str(uuid.uuid4()),
        "title": title,
        "type": type,
        "description": description,
        "link": link,
        "price": price,
        "image_b64": image_b64,
        "image_ct": image_ct,
        "created_at": now_iso(),
    }
    await db.portfolio.insert_one(doc)
    return {"ok": True, "work": work_out(doc)}


@api_router.put("/portfolio/{work_id}")
async def update_work(
    work_id: str,
    title: str = Form(...),
    type: str = Form(...),
    description: str = Form(...),
    link: str = Form(""),
    price: str = Form(...),
    file: Optional[UploadFile] = File(None),
    authorization: str = Header(default=""),
):
    require_admin(authorization)
    update = {"title": title, "type": type, "description": description, "link": link, "price": price}
    image_b64, image_ct = await read_work_image(file)
    if image_b64:
        update["image_b64"] = image_b64
        update["image_ct"] = image_ct
    result = await db.portfolio.update_one({"_id": work_id}, {"$set": update})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Trabajo no encontrado")
    doc = await db.portfolio.find_one({"_id": work_id})
    return {"ok": True, "work": work_out(doc)}


@api_router.delete("/portfolio/{work_id}")
async def delete_work(work_id: str, authorization: str = Header(default="")):
    require_admin(authorization)
    result = await db.portfolio.delete_one({"_id": work_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Trabajo no encontrado")
    return {"ok": True}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
