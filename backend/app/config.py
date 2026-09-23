"""รองรับ CON-TECH-01: อ่าน DATABASE_URL (PostgreSQL) จากตัวแปรแวดล้อม"""
import os
from functools import lru_cache


class Settings:
    def __init__(self) -> None:
        self.database_url = os.environ.get("DATABASE_URL", "sqlite:///:memory:")


@lru_cache
def get_settings() -> Settings:
    """รองรับ CON-TECH-01: คืนค่า Settings เดียวกันทุกครั้งที่เรียกในโปรเซสเดียว"""
    return Settings()
