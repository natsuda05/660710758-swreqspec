"""รองรับ CON-TECH-01: โครง FastAPI app เริ่มต้น (รวม router ของ task อื่นภายหลัง)"""
from fastapi import FastAPI

from app.config import get_settings

app = FastAPI(title="Booking API")


@app.get("/health")
def health() -> dict:
    """รองรับ CON-TECH-01: endpoint ตรวจสอบว่า app ขึ้นและอ่านค่า config ได้"""
    settings = get_settings()
    return {"status": "ok", "database_url": settings.database_url}
