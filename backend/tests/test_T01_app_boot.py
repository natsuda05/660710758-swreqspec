"""ยืนยัน 'เสร็จเมื่อ' ของ T-01: app เปิดขึ้นได้ (import ได้) และอ่านค่า DATABASE_URL จาก config ได้"""
import importlib

from fastapi.testclient import TestClient


def test_T01_app_imports_and_reads_database_url(monkeypatch):
    monkeypatch.setenv("DATABASE_URL", "postgresql://user:pass@localhost/booking")

    from app import config

    importlib.reload(config)
    config.get_settings.cache_clear()

    settings = config.get_settings()
    assert settings.database_url == "postgresql://user:pass@localhost/booking"

    from app.main import app

    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["database_url"] == "postgresql://user:pass@localhost/booking"
