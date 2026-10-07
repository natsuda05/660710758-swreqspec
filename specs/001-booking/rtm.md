# RTM: จองคิวตรวจสุขภาพ (Booking)
อ้างอิง: spec.md SPEC-BKG-001 Draft v2 | tasks.md (เสร็จ T-01 ถึง T-03) | test-cases.md
สร้างด้วย /verify เมื่อ 2569-10-07 08.43 | test: 6 ผ่าน 1 ไม่ผ่าน (pytest) / หน้าจอ 1 ผ่าน 1 todo (vitest)

ผล test ที่รัน
- pytest: test_AC_BKG_01 ผ่าน, test_TC_BKG_01_1_book_last_seat ผ่าน, **test_TC_BKG_01_4_no_seat_left ไม่ผ่าน**, test_TC_BKG_01_6_not_authenticated ผ่าน, test_AC_BKG_05 ผ่าน, test_T01_tables_created ผ่าน, test_T01_no_national_id ผ่าน
- vitest: setup.test.jsx ผ่าน, TC-BKG-01-2.test.jsx เป็น todo (รอ Q-02)

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-BKG-01 | AC-BKG-05 (ตรวจแค่ความเร็ว) | T-02 เสร็จ, T-10 | slots/router.py: get_slots, slots/service.py: list_available_slots | test_AC_BKG_05 (ผ่าน) ไม่ได้ตรวจช่วง 30 วัน | ช่องโหว่ (F-04, F-10) |
| FR-BKG-02 | AC-BKG-02 | T-04 พร้อมทำ | ยังไม่มี (create_booking ไม่ตรวจการจองซ้ำวันเดียวกัน) | ไม่มี | ยังไม่ถึง |
| FR-BKG-03 | AC-BKG-03 | T-05, T-11, T-12 พร้อมทำ | มีแค่ 409 "ช่วงเวลาเต็ม" ใน booking/router.py ยังไม่เสนอ 3 ช่วง | ไม่มี | ยังไม่ถึง |
| FR-BKG-04 | AC-BKG-01 | T-03 เสร็จ, T-06 รอ Q-02, T-07 | booking/router.py: create_booking, booking/service.py: create_booking, next_queue_no | test_AC_BKG_01 (ผ่าน), test_TC_BKG_01_1 (ผ่าน), test_TC_BKG_01_4 (ไม่ผ่าน), test_TC_BKG_01_6 (ผ่าน) | ช่องโหว่ (F-01, F-07, F-08) |
| FR-BKG-05 | AC-BKG-04 | T-07 พร้อมทำ, T-06 รอ Q-02 | ยังไม่มี (ไม่มี notify/queue.py) | ไม่มี | ยังไม่ถึง |
| FR-BKG-06 | ไม่มี AC | T-02 เสร็จ, T-10 | slots/service.py: list_available_slots (กรอง package_code) | ไม่มี test ที่ตรวจการเปลี่ยนแพ็กเกจ | ช่องโหว่ (F-11) |
| NFR-PERF-01 | AC-BKG-05 | T-02 เสร็จ | slots/service.py: list_available_slots | test_AC_BKG_05 (ผ่าน) เรียกทีละครั้ง ไม่ใช่พร้อมกัน | ช่องโหว่ (F-09) |
| NFR-SEC-01 | ไม่มี AC | ไม่มี task | ไม่มี | ไม่มี | ช่องโหว่ (F-12) |
| NFR-REL-02 | AC-BKG-04 | T-07 พร้อมทำ | ยังไม่มี | ไม่มี | ยังไม่ถึง |
| NFR-USE-01 | ไม่มี AC | ไม่มี task | ไม่มี | ไม่มี | ช่องโหว่ (F-13) |
| CON-TECH-01 | ไม่มี AC | T-01 เสร็จ | config.py: DATABASE_URL, db/session.py | test_T01_tables_created (ผ่าน บน SQLite ตาม plan ข้อ 2) | ครบ (Constraint ไม่มี AC ตรวจด้วย test ของ T-01 ตาม tasks.md ทีมยืนยัน) |
| DOM-PDPA-01 | AC-BKG-06 | T-01 เสร็จ (ตาราง), T-08 พร้อมทำ | db/models.py: AuditLog มีตาราง แต่ยังไม่มีโค้ดบันทึก (ไม่มี audit/middleware.py) | ไม่มี | ยังไม่ถึง |
| IF-IDP-01 | ไม่มี AC ตรง (อยู่ใน Given ของ AC-BKG-01) | T-03 เสร็จ | auth/idp.py: get_verified_hn | test_TC_BKG_01_6 (ผ่าน) | ช่องโหว่ (F-03) |
| IF-HIS-01 | ไม่มี AC | T-01 เสร็จ, T-09 พร้อมทำ | db/models.py: Booking ไม่มี national_id | test_T01_no_national_id (ผ่าน) | ช่องโหว่ (F-02) |
| IF-NOT-01 | AC-BKG-04 | T-07 พร้อมทำ | ยังไม่มี | ไม่มี | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| slots/router.py: GET /slots | FR-BKG-01, FR-BKG-06 | ตรงบางส่วน | มีใน plan ข้อ 4 แต่แสดงล่วงหน้า 14 วัน ไม่ใช่ 30 วัน (F-04) |
| slots/service.py: list_available_slots, DAYS_AHEAD = 14 | FR-BKG-01, FR-BKG-06 | ไม่ตรง | ตัวเลข 14 ขัดกับ "30 วันข้างหน้า" (F-04) |
| booking/router.py: POST /bookings | FR-BKG-04, IF-IDP-01 | ตรงบางส่วน | มีใน plan ข้อ 4 ส่วน response มี slot_id เพิ่มมา ไม่เปลี่ยนสิ่งที่ผู้ใช้ได้ |
| booking/router.py: BookingRequest.national_id | ไม่อ้าง (คอมเมนต์ "เผื่อใช้ค้น HN จาก HIS") | ไม่ตรง | plan ข้อ 4 ให้รับเลขบัตรที่ GET /patients/lookup เท่านั้น POST /bookings รับแค่ slot_id (F-02) |
| booking/router.py: logger.info("booking request ...") | ไม่อ้าง | ไม่ตรง | เขียน national_id ลง log (F-02) |
| booking/service.py: create_booking | FR-BKG-04 | ตรงบางส่วน | ตัดที่นั่งและบันทึก แต่เงื่อนไข `remaining < 0` ปล่อยให้จองช่วงที่เต็มแล้ว (F-01) ยังไม่ส่งคำขอส่งข้อความ (T-07 ยังไม่ถึง) |
| booking/service.py: next_queue_no | FR-BKG-04 | ไม่ตรง | ออกเลขรูปแบบ A001 รีเซ็ตรายวัน ซึ่งเป็นเรื่องของ Q-02 ที่ยังไม่ได้คำตอบ (F-07) |
| booking/router.py: DELETE /bookings/{id} | FR-BKG-04 | ไม่ตรง | ยกเลิกคิว อยู่ใน Out of scope (UC-02) ไม่มีใน plan ข้อ 4 (F-05, F-06) |
| booking/service.py: cancel_booking | FR-BKG-04 | ไม่ตรง | FR-BKG-04 พูดถึงการยืนยันการจอง ไม่ใช่การยกเลิก (F-05, F-06) |
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
| F-01 | ตัวเลขไม่ตรง spec | backend/app/booking/service.py:26 | FR-BKG-04, FR-BKG-03, AC-BKG-01 (TC-BKG-01-4) | เงื่อนไข `if slot.remaining < 0` ไม่ทำงานเมื่อที่นั่งเหลือ 0 ระบบจึงจองช่วงที่เต็มแล้วได้ ที่นั่งติดลบเป็น -1 และเกิดการจองเกินโควตา test_TC_BKG_01_4 ไม่ผ่านเพราะเรื่องนี้ วิธีแก้ที่น่าจะเป็น: เปลี่ยนเป็น `<= 0` | |
| F-02 | ละเมิด Constraint | backend/app/booking/router.py:19, :25 | IF-HIS-01 | POST /bookings รับ `national_id` เข้ามา และเขียนเลขบัตรประชาชนลง log ทุกครั้งที่จอง ตารางไม่เก็บเลขบัตรก็จริง แต่เลขบัตรไปอยู่ใน log แทน plan ข้อ 4 กำหนดให้รับเลขบัตรที่ GET /patients/lookup เท่านั้น test_T01_no_national_id ตรวจแค่ตาราง จึงไม่เจอเรื่องนี้ | |
| F-03 | ละเมิด Constraint | backend/app/auth/idp.py:13-15 | IF-IDP-01 | ไม่ได้รับผลยืนยันตัวตนจากระบบยืนยันตัวตน แค่เชื่อ header `Bearer verified:<HN>` ใครก็ส่ง HN ของคนอื่นแล้วจองแทนได้ คอมเมนต์เขียนว่าเป็นตัวจำลอง แต่ T-03 ซึ่งรองรับ IF-IDP-01 มีสถานะ "เสร็จ" แล้ว ทีมต้องตัดสินว่ายอมรับตัวจำลองในเฟสนี้ หรือต้องเพิ่ม task | |
| F-04 | ตัวเลขไม่ตรง spec | backend/app/slots/service.py:10, :16 | FR-BKG-01 | `DAYS_AHEAD = 14` แต่ spec กำหนด "ภายใน 30 วันข้างหน้า" และเงื่อนไข `<= end` นับรวมวันสุดท้าย จึงแสดงจริง 15 วัน ไม่มี test ไหนจับได้ เพราะ test_AC_BKG_05 สร้างช่วงเวลาไว้แค่วันพรุ่งนี้ | |
| F-05 | โค้ดไม่มี FR | backend/app/booking/router.py:35-41, backend/app/booking/service.py:42-50 | Out of scope (UC-02 ยกเลิก / เลื่อนคิว) | DELETE /bookings/{id} สำหรับยกเลิกการจอง อยู่ใน Out of scope ไม่มีใน plan ข้อ 4 และไม่มี task รองรับ (prompt-log ของ T-03 บอกว่าเพิ่ม "เพื่อความสมบูรณ์ของระบบ") | |
| F-06 | อ้าง ID ผิดเรื่อง | backend/app/booking/router.py:37, backend/app/booking/service.py:43 | FR-BKG-04 | cancel_booking อ้าง FR-BKG-04 แต่ FR-BKG-04 พูดถึง "เมื่อยืนยันสำเร็จ ... บันทึกการจอง ตัดจำนวนที่นั่ง" ไม่ได้พูดถึงการยกเลิกหรือคืนที่นั่ง | |
| F-07 | เดา Q-02 | backend/app/booking/service.py:13-18 | Q-02 | next_queue_no ออกเลขรูปแบบ `A001` และเริ่มนับใหม่ทุกวัน ซึ่งเอาตัวอย่างในวงเล็บของ Q-02 "(เช่น A001)" มาใช้เป็นคำตอบ ทั้งที่ plan ข้อ 3 และ models.py:33 บอกว่ายังไม่กำหนดวิธีออกเลขจนกว่า Q-02 จะได้คำตอบ | |
| F-08 | test อ่อน | backend/tests/test_AC_BKG_01.py: test_AC_BKG_01 | AC-BKG-01 | ชื่ออ้าง AC-BKG-01 แต่ assert แค่ `status_code == 201` ไม่ได้ดูว่าบันทึกจริงหรือที่นั่งเป็น 0 ตอนนี้ test_TC_BKG_01_1 ตรวจสองส่วนนี้แทนแล้ว แต่ตัว test_AC_BKG_01 เองยังผ่านได้ แม้ลบบรรทัดตัดที่นั่งออก | |
| F-09 | test อ่อน | backend/tests/test_AC_BKG_05.py | AC-BKG-05, NFR-PERF-01 | Given "ผู้ใช้พร้อมกัน 200 คน" แต่ test เรียก 200 ครั้งต่อกันทีละครั้ง ไม่ได้ส่งพร้อมกัน และใช้ SQLite กับข้อมูล 10 ช่วงเวลา ผ่านในตอนนี้ไม่ได้แปลว่า NFR-PERF-01 เป็นจริง (plan ข้อ 6 บอกว่าผลจริงต้องวัดบนเครื่องทดสอบ แต่ยังไม่มี task หรือแผนวัด) | |
| F-10 | FR ไม่มี AC | spec.md FR-BKG-01 | FR-BKG-01 | AC เดียวที่อ้าง FR-BKG-01 คือ AC-BKG-05 ซึ่งตรวจแค่ความเร็ว ไม่มี AC ตรวจว่าแสดงช่วง 30 วันและจำนวนที่นั่งคงเหลือ F-04 จึงหลุดมาได้ | |
| F-11 | FR ไม่มี AC | spec.md FR-BKG-06 | FR-BKG-06 | ไม่มี AC เลย plan ข้อ 6 ก็ระบุไว้แล้วว่าควรเสนอทีมเพิ่ม AC | |
| F-12 | FR ไม่มี AC | spec.md NFR-SEC-01 | NFR-SEC-01 | ไม่มี AC และไม่มี task รองรับ TLS 1.2 ขึ้นไป | |
| F-13 | FR ไม่มี AC | spec.md NFR-USE-01 | NFR-USE-01 | ไม่มี AC และไม่มี task สำหรับทดสอบกับอาสาสมัคร 10 คน (ASM-05) | |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
