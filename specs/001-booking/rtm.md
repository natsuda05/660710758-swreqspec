# RTM: จองคิวตรวจสุขภาพ (Booking)
อ้างอิง: spec.md SPEC-BKG-001 Draft v2 | tasks.md (เสร็จ T-01 ถึง T-03) | test-cases.md
สร้างด้วย /verify เมื่อ 2569-10-07 09.12 (รอบที่ 3 รอบก่อน 08.43, 08.57) | test: 9 ผ่าน 0 ไม่ผ่าน (pytest) / หน้าจอ 1 ผ่าน 1 todo (vitest)

ผล test ที่รัน
- pytest: test_AC_BKG_01 ผ่าน, test_TC_BKG_01_1_book_last_seat ผ่าน, test_TC_BKG_01_4_no_seat_left ผ่าน, test_TC_BKG_01_5_two_seats_left ผ่าน, test_TC_BKG_01_6_not_authenticated ผ่าน, test_TC_BKG_01_7_slot_not_found ผ่าน, test_AC_BKG_05 ผ่าน, test_T01_tables_created ผ่าน, test_T01_no_national_id ผ่าน
- vitest: setup.test.jsx ผ่าน, TC-BKG-01-2.test.jsx เป็น todo (รอ Q-02)

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-BKG-01 | AC-BKG-05 (ตรวจแค่ความเร็ว) | T-02 เสร็จ, T-10 | slots/router.py: get_slots, slots/service.py: list_available_slots (DAYS_AHEAD = 30) | test_AC_BKG_05 (ผ่าน) ไม่มี test ตรวจช่วง 30 วัน | ช่องโหว่ (F-10) |
| FR-BKG-02 | AC-BKG-02 | T-04 พร้อมทำ | ยังไม่มี (create_booking ไม่ตรวจการจองซ้ำวันเดียวกัน) | ไม่มี | ยังไม่ถึง |
| FR-BKG-03 | AC-BKG-03 | T-05, T-11, T-12 พร้อมทำ | มีแค่ 409 "ช่วงเวลาเต็ม" ใน booking/router.py ยังไม่เสนอ 3 ช่วง | ไม่มี | ยังไม่ถึง |
| FR-BKG-04 | AC-BKG-01 | T-03 เสร็จ, T-06 รอ Q-02, T-07 พร้อมทำ | booking/router.py: create_booking, booking/service.py: create_booking (บันทึก ตัดที่นั่ง queue_no ว่างไว้) | test_AC_BKG_01, test_TC_BKG_01_1, _4, _5, _6, _7 (ผ่านทั้งหมด) ส่วน "แสดงหมายเลขคิว" ไม่ assert เพราะรอ Q-02 | รอ Q-02 (ออกหมายเลขคิว) ส่วนส่งคำขอส่งข้อความยังไม่ถึง (T-07) |
| FR-BKG-05 | AC-BKG-04 | T-07 พร้อมทำ, T-06 รอ Q-02 | ยังไม่มี (ไม่มี notify/queue.py) | ไม่มี | ยังไม่ถึง |
| FR-BKG-06 | ไม่มี AC | T-02 เสร็จ, T-10 | slots/service.py: list_available_slots (กรอง package_code) | ไม่มี test ที่ตรวจการเปลี่ยนแพ็กเกจ | ช่องโหว่ (F-11) |
| NFR-PERF-01 | AC-BKG-05 | T-02 เสร็จ | slots/service.py: list_available_slots | test_AC_BKG_05 (ผ่าน) เรียกทีละครั้ง ไม่ใช่พร้อมกัน | ช่องโหว่ (F-09) |
| NFR-SEC-01 | ไม่มี AC | ไม่มี task | ไม่มี | ไม่มี | ช่องโหว่ (F-12) |
| NFR-REL-02 | AC-BKG-04 | T-07 พร้อมทำ | ยังไม่มี | ไม่มี | ยังไม่ถึง |
| NFR-USE-01 | ไม่มี AC | ไม่มี task | ไม่มี | ไม่มี | ช่องโหว่ (F-13) |
| CON-TECH-01 | ไม่มี AC | T-01 เสร็จ | config.py: DATABASE_URL, db/session.py | test_T01_tables_created (ผ่าน บน SQLite ตาม plan ข้อ 2) | ครบ (Constraint ไม่มี AC ตรวจด้วย test ของ T-01 ตาม tasks.md ทีมยืนยัน) |
| DOM-PDPA-01 | AC-BKG-06 | T-01 เสร็จ (ตาราง), T-08 พร้อมทำ | db/models.py: AuditLog มีตาราง แต่ยังไม่มีโค้ดบันทึก (ไม่มี audit/middleware.py) | ไม่มี | ยังไม่ถึง |
| IF-IDP-01 | ไม่มี AC ตรง (อยู่ใน Given ของ AC-BKG-01) | T-03 เสร็จ | auth/idp.py: get_verified_hn | test_TC_BKG_01_6 (ผ่าน) | ช่องโหว่ (F-03) |
| IF-HIS-01 | ไม่มี AC | T-01 เสร็จ, T-09 พร้อมทำ | db/models.py: Booking ไม่มี national_id, POST /bookings ไม่รับ national_id แล้ว ยังไม่มีการค้น HN จาก HIS | test_T01_no_national_id (ผ่าน) | ยังไม่ถึง (ส่วนค้น HIS รอ T-09) |
| IF-NOT-01 | AC-BKG-04 | T-07 พร้อมทำ | ยังไม่มี | ไม่มี | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| slots/router.py: GET /slots | FR-BKG-01, FR-BKG-06 | ตรง | มีใน plan ข้อ 4 แสดงล่วงหน้า 30 วันแล้ว |
| slots/service.py: list_available_slots, DAYS_AHEAD = 30 | FR-BKG-01, FR-BKG-06 | ตรง | ตัวเลขตรง spec ขอบช่วง (นับวันนี้ด้วยหรือไม่) spec ไม่ได้บอก รอ AC ตาม F-10 |
| booking/router.py: POST /bookings | FR-BKG-04, IF-IDP-01 | ตรงบางส่วน | request รับแค่ slot_id ตรง plan ข้อ 4 แล้ว docstring บรรทัด 23 บอกว่า "คืนหมายเลขคิว" แต่ตอนนี้ queue_no เป็นค่าว่างเสมอ (รอ Q-02) ไม่เปลี่ยนสิ่งที่ผู้ใช้ได้ จึงไม่นับเป็นข้อค้นพบ |
| booking/router.py: logger.info("booking request ...") | ไม่อ้าง | ตรง | log แค่ slot และ hn ไม่มีเลขบัตรประชาชนแล้ว |
| booking/service.py: create_booking | FR-BKG-04 | ตรงบางส่วน | ตรวจที่นั่ง ตัดที่นั่ง บันทึกการจอง ไม่ออกเลขคิว (รอ Q-02) ยังไม่ส่งคำขอส่งข้อความ (T-07 ยังไม่ถึง) |
| auth/idp.py: get_verified_hn | IF-IDP-01 | ตรงบางส่วน | ไม่ได้ถามระบบยืนยันตัวตนจริง เชื่อ HN ที่อยู่ใน header (F-03) |
| db/models.py: Slot, Booking, AuditLog | CON-TECH-01, DOM-PDPA-01, IF-HIS-01, FR-BKG-01, FR-BKG-04, FR-BKG-06 | ตรง | ตรงกับ plan ข้อ 3, bookings ไม่มี national_id |
| db/migrations/001_init.py: upgrade | CON-TECH-01, DOM-PDPA-01, IF-HIS-01 | ตรง | |
| config.py: DATABASE_URL (ค่าเริ่มต้น sqlite) | CON-TECH-01 | ตรง | ค่าเริ่มต้น SQLite ใช้ใน Codespace ตาม plan ข้อ 2 ระบบจริงต้องตั้งเป็น PostgreSQL |
| db/session.py: get_db, main.py: lifespan | CON-TECH-01 | ตรง | |
| frontend/src/api/client.js: getSlots, createBooking | plan ข้อ 4 | ตรงบางส่วน | createBooking ไม่ส่งผลยืนยันตัวตนไปด้วย จะได้ 401 แต่อยู่ใน T-12 ซึ่งยังไม่ได้ทำ จึงยังไม่นับเป็นข้อค้นพบ |
| frontend/src/App.jsx | ไม่อ้าง | - | โครงเริ่มต้นของรายวิชา ยังไม่มีหน้าจอของ task ใด |

## 3. ข้อค้นพบ
ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง
ทีมตัดสิน: แก้โค้ด / แก้ spec / เพิ่ม Q-xx / ไม่ใช่ปัญหา (พร้อมเหตุผล 1 บรรทัด)

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-03 | ละเมิด Constraint | backend/app/auth/idp.py:13-15 | IF-IDP-01 | ไม่ได้รับผลยืนยันตัวตนจากระบบยืนยันตัวตน แค่เชื่อ header `Bearer verified:<HN>` ใครก็ส่ง HN ของคนอื่นแล้วจองแทนได้ คอมเมนต์เขียนว่าเป็นตัวจำลอง แต่ T-03 ซึ่งรองรับ IF-IDP-01 มีสถานะ "เสร็จ" แล้ว ทีมต้องตัดสินว่ายอมรับตัวจำลองในเฟสนี้ หรือต้องเพิ่ม task | เพิ่ม Q-03: ยอมรับตัวจำลองการยืนยันตัวตนในเฟสนี้ หรือต้องต่อระบบยืนยันตัวตนจริงก่อน (spec ไม่ได้บอกวิธีและช่วงเวลาที่ต้องต่อ) |
| F-08 | test อ่อน | backend/tests/test_AC_BKG_01.py: test_AC_BKG_01 | AC-BKG-01 | ชื่ออ้าง AC-BKG-01 แต่ assert แค่ `status_code == 201` ไม่ได้ดูว่าบันทึกจริงหรือที่นั่งเป็น 0 ตอนนี้ test_TC_BKG_01_1 ตรวจสองส่วนนี้แทนแล้ว แต่ตัว test_AC_BKG_01 เองยังผ่านได้ แม้ลบบรรทัดตัดที่นั่งออก | ไม่ใช่ปัญหา: test_TC_BKG_01_1 ตรวจการบันทึกและที่นั่งเป็น 0 ครบแล้ว test_AC_BKG_01 เป็น test เดิมที่ห้ามลบ |
| F-09 | test อ่อน | backend/tests/test_AC_BKG_05.py | AC-BKG-05, NFR-PERF-01 | Given "ผู้ใช้พร้อมกัน 200 คน" แต่ test เรียก 200 ครั้งต่อกันทีละครั้ง ไม่ได้ส่งพร้อมกัน และใช้ SQLite กับข้อมูล 10 ช่วงเวลา ผ่านในตอนนี้ไม่ได้แปลว่า NFR-PERF-01 เป็นจริง (plan ข้อ 6 บอกว่าผลจริงต้องวัดบนเครื่องทดสอบ แต่ยังไม่มี task หรือแผนวัด) | แก้ spec: AC-BKG-05 ต้องระบุว่าวัดที่ไหนและด้วยเครื่องมืออะไร เพราะ Codespace จำลองผู้ใช้พร้อมกัน 200 คนจริงไม่ได้ |
| F-10 | FR ไม่มี AC | spec.md FR-BKG-01 | FR-BKG-01 | AC เดียวที่อ้าง FR-BKG-01 คือ AC-BKG-05 ซึ่งตรวจแค่ความเร็ว ไม่มี AC ตรวจว่าแสดงช่วง 30 วันและจำนวนที่นั่งคงเหลือ F-04 จึงหลุดมาได้ | แก้ spec: เพิ่ม AC ของ FR-BKG-01 ที่ตรวจช่วง 30 วัน (วันที่ 30 และ 31) และจำนวนที่นั่งคงเหลือ |
| F-11 | FR ไม่มี AC | spec.md FR-BKG-06 | FR-BKG-06 | ไม่มี AC เลย plan ข้อ 6 ก็ระบุไว้แล้วว่าควรเสนอทีมเพิ่ม AC | แก้ spec: เพิ่ม AC ของ FR-BKG-06 เรื่องเปลี่ยนแพ็กเกจแล้วช่วงเวลาว่างคำนวณใหม่ |
| F-12 | FR ไม่มี AC | spec.md NFR-SEC-01 | NFR-SEC-01 | ไม่มี AC และไม่มี task รองรับ TLS 1.2 ขึ้นไป | แก้ spec: เพิ่ม AC หรือ Constraint ของ NFR-SEC-01 ว่าตรวจ TLS 1.2 ที่ไหน (น่าจะตอน deploy) |
| F-13 | FR ไม่มี AC | spec.md NFR-USE-01 | NFR-USE-01 | ไม่มี AC และไม่มี task สำหรับทดสอบกับอาสาสมัคร 10 คน (ASM-05) | แก้ spec: เพิ่ม AC ของ NFR-USE-01 ที่ตรวจโดยคน กับอาสาสมัคร 10 คน |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
| F-01 | backend/app/booking/service.py:26 เปลี่ยน `if slot.remaining < 0:` เป็น `if slot.remaining <= 0:` (commit 5cf81ce ทีมสั่งแก้ 2569-10-07) | อ่านโค้ดบรรทัด 26 แล้ว และ test_TC_BKG_01_4_no_seat_left ที่เคยไม่ผ่าน ผ่านแล้วในรอบนี้ (ว่าง 0 ที่ ได้ 409 ไม่มีการจอง ที่นั่งยังเป็น 0) |
| F-02 | backend/app/booking/router.py ลบ national_id ออกจาก BookingRequest และออกจาก logger.info | อ่าน router.py แล้ว BookingRequest มีแค่ slot_id (บรรทัด 17-18) log บรรทัด 24 มีแค่ slot และ hn และ grep "national" ใน backend/app ไม่เจอ ยังไม่มี test ตรวจ request/log (test_T01_no_national_id ตรวจแค่ตาราง) |
| F-04 | backend/app/slots/service.py:10 DAYS_AHEAD 14 -> 30 | อ่านโค้ดบรรทัด 10 แล้ว ยังไม่มี test ตรวจช่วง 30 วัน (ติด F-10 ที่ยังไม่มี AC) |
| F-05 | ลบ DELETE /bookings/{id} และ service.cancel_booking | อ่าน router.py และ service.py แล้วไม่มี endpoint/ฟังก์ชันนี้ grep "delete\|cancel" ใน backend/app ไม่เจอ |
| F-06 | คอมเมนต์ที่อ้าง FR-BKG-04 ผิดเรื่องหายไปพร้อมการลบตาม F-05 | grep "cancel" ไม่เจอ คอมเมนต์ FR-BKG-04 ที่เหลืออยู่เป็นเรื่องยืนยันการจอง ตรงกับ FR |
| F-07 | ลบ next_queue_no (รูปแบบ A001) queue_no ว่างไว้ | อ่าน service.py แล้วไม่มีการออกเลขคิว grep "A{" ไม่เจอ test ทั้งหมดยังผ่าน |
| F-14 | เพิ่ม test_TC_BKG_01_5_two_seats_left และ test_TC_BKG_01_7_slot_not_found ตามแถว "ใช้ได้" | pytest -v รอบนี้เห็นทั้ง 2 ตัวและผ่าน แถวที่ "ใช้ได้" ใน test-cases.md มี test ครบ (-2 เป็น todo รอ Q-02, -3 ตรวจด้วยคน) |

สรุป
1. 