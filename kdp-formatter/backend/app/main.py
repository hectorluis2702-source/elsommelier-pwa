import io
import os

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from . import kdp_rules
from .manuscript_parser import parse_manuscript
from .pdf_builder import PdfRequest, build_pdf

app = FastAPI(title="KDP Manuscript PDF Formatter")

_allowed_origins = os.environ.get("ALLOWED_ORIGIN", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_UPLOAD_BYTES = 15 * 1024 * 1024  # 15 MB


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/trim-sizes")
def trim_sizes():
    return {"sizes": list(kdp_rules.TRIM_SIZES.keys()), "default": kdp_rules.DEFAULT_TRIM_SIZE}


@app.post("/api/generate-pdf")
async def generate_pdf(
    file: UploadFile = File(...),
    trim_size: str = Form(kdp_rules.DEFAULT_TRIM_SIZE),
    font_family: str = Form("garamond"),
    font_size: float = Form(11.0),
    title: str = Form(""),
    author: str = Form(""),
):
    if trim_size not in kdp_rules.TRIM_SIZES:
        raise HTTPException(status_code=400, detail=f"trim_size inválido: {trim_size}")
    if not (10.0 <= font_size <= 12.0):
        raise HTTPException(status_code=400, detail="font_size debe estar entre 10 y 12 pt")
    if not file.filename.lower().endswith((".txt", ".md", ".markdown")):
        raise HTTPException(status_code=400, detail="Solo se aceptan archivos .txt o .md")

    raw_bytes = await file.read()
    if len(raw_bytes) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="El manuscrito supera el límite de 15 MB")

    try:
        raw_text = raw_bytes.decode("utf-8")
    except UnicodeDecodeError:
        raw_text = raw_bytes.decode("latin-1")

    chapters = parse_manuscript(raw_text)
    if not chapters or all(not ch.paragraphs_html for ch in chapters):
        raise HTTPException(status_code=422, detail="El manuscrito está vacío o no se pudo interpretar")

    req = PdfRequest(
        trim_size_key=trim_size,
        font_key=font_family,
        font_size_pt=font_size,
        title=title.strip(),
        author=author.strip(),
    )

    pdf_bytes, page_count, geometry = build_pdf(chapters, req)

    headers = {
        "Content-Disposition": f'attachment; filename="{(title or "manuscrito").strip() or "manuscrito"}-kdp.pdf"',
        "X-Page-Count": str(page_count),
        "X-Gutter-Inches": str(geometry.gutter_in),
    }
    return StreamingResponse(io.BytesIO(pdf_bytes), media_type="application/pdf", headers=headers)
