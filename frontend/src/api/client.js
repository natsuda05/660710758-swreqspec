// จุดเดียวที่หน้าจอใช้เรียก API หลังบ้าน (ตามสัญญา API ใน plan.md ข้อ 4)
// ตอน test ให้ส่ง client จำลองเข้าไปในหน้าจอแทน ไม่ต้องรันหลังบ้านจริง
// เรียกผ่าน /api (ดู proxy ใน vite.config.js) หลังบ้านต้องรันอยู่ที่ port 8000
const BASE = import.meta.env.VITE_API_BASE ?? '/api'

// รองรับ FR-BKG-01, FR-BKG-06: ฟังก์ชันจำลอง (mock) แทน GET /slots ใช้ก่อนต่อ backend จริงใน T-21
export function mockGetSlots({ dateFrom, packageCode }) {
  const times = ['09:00', '10:00', '13:00']
  const slots = []
  for (let dayOffset = 0; dayOffset < 3; dayOffset += 1) {
    const d = new Date(dateFrom)
    d.setDate(d.getDate() + dayOffset)
    const slotDate = d.toISOString().slice(0, 10)
    times.forEach((startTime, i) => {
      const seed = (slotDate.length + startTime.length + (packageCode?.length ?? 0) + i) % 6
      slots.push({ slot_date: slotDate, start_time: startTime, package_code: packageCode, remaining: seed })
    })
  }
  return Promise.resolve(slots)
}

export const api = {
  async getSlots({ dateFrom, packageCode }) {
    const q = new URLSearchParams({ date_from: dateFrom, package_code: packageCode })
    const res = await fetch(`${BASE}/slots?${q}`)
    return res.json()
  },
  async createBooking({ slotId }) {
    const res = await fetch(`${BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot_id: slotId }),
    })
    return { status: res.status, body: await res.json() }
  },
}
