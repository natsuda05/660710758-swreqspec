# test ของ T-03: จองคิวสำเร็จ
# AC-BKG-01 (FR-BKG-04)
from tests.conftest import AUTH


def test_AC_BKG_01(client, make_slot):
    """AC-BKG-01: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง จองแล้วต้องสำเร็จ"""
    slot = make_slot(start="09:00", remaining=1)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    assert res.status_code == 201


# ---- test จาก test-cases.md (TC-BKG-01-*) ห้ามแก้ให้ผ่าน ----
from sqlalchemy import select

from app.db.models import Booking, Slot


def _bookings_of_slot(db, slot_id):
    db.expire_all()
    return db.scalars(select(Booking).where(Booking.slot_id == slot_id)).all()


def _remaining(db, slot_id):
    db.expire_all()
    return db.get(Slot, slot_id).remaining


def test_TC_BKG_01_1_book_last_seat(client, db, make_slot):
    """TC-BKG-01-1 (AC-BKG-01 ทางปกติ)"""
    # Given ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่
    slot = make_slot(start="09:00", remaining=1)

    # When ยืนยันการจองช่วง 09.00 น. (POST /bookings)
    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    # Then (1) บันทึกสำเร็จ: มีรายการจองของ HN นี้ที่ช่วง 09.00 น. ในตาราง bookings
    bookings = _bookings_of_slot(db, slot.id)
    assert len(bookings) == 1
    assert bookings[0].hn == "0001234"
    # Then (2) คำตอบมี booking id และ queue_no (รอ Q-02)
    body = res.json()
    assert body["booking_id"] == bookings[0].id
    # queue_no: ยังไม่ตรวจ เพราะรอ Q-02 (รูปแบบหมายเลขคิว)
    # Then (3) ที่นั่งว่าง (remaining) ของช่วง 09.00 น. เป็น 0
    assert _remaining(db, slot.id) == 0


def test_TC_BKG_01_4_no_seat_left(client, db, make_slot):
    """TC-BKG-01-4 (AC-BKG-01 ขอบ)"""
    # Given ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง 0 ที่
    slot = make_slot(start="09:00", remaining=0, capacity=1)

    # When ยืนยันการจองช่วง 09.00 น.
    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    # Then (1) ไม่สร้างรายการจอง (FR-BKG-03)
    assert _bookings_of_slot(db, slot.id) == []
    # Then (2) ตอบ 409 (plan ข้อ 4)
    assert res.status_code == 409
    # Then (3) ที่นั่งว่างของช่วง 09.00 น. ยังเป็น 0 (FR-BKG-04)
    assert _remaining(db, slot.id) == 0



def test_TC_BKG_01_6_not_authenticated(client, db, make_slot):
    """TC-BKG-01-6 (AC-BKG-01 ทางผิด)"""
    # Given ยังไม่ยืนยันตัวตน และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่
    slot = make_slot(start="09:00", remaining=1)

    # When ยืนยันการจองช่วง 09.00 น. (ไม่มีผลยืนยันตัวตน)
    client.post("/bookings", json={"slot_id": slot.id})

    # Then (1) ไม่มีรายการจองถูกบันทึก (IF-IDP-01)
    assert _bookings_of_slot(db, slot.id) == []
    # Then (2) ที่นั่งว่างของช่วง 09.00 น. ยังเป็น 1
    assert _remaining(db, slot.id) == 1
    # Then (3) รหัสตอบกลับ / ข้อความแจ้ง: spec ไม่ได้บอก จึงยังไม่ตรวจ
