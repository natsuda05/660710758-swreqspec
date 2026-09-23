import { useEffect, useState } from 'react'
import { mockGetSlots } from '../api/client.js'

// รายชื่อแพ็กเกจตัวอย่างสำหรับแสดงผล (ทีมเลือกเอง ไม่ได้มาจาก spec) รอรายการจริงจากระบบหลังบ้าน
const PACKAGE_OPTIONS = [
  { code: 'PKG-GENERAL', label: 'ตรวจสุขภาพทั่วไป' },
  { code: 'PKG-SENIOR', label: 'ตรวจสุขภาพผู้สูงอายุ' },
]

function todayISODate() {
  return new Date().toISOString().slice(0, 10)
}

// รองรับ FR-BKG-01, FR-BKG-06: แสดงช่วงเวลาว่างพร้อมที่นั่งคงเหลือ และโหลดใหม่เมื่อเปลี่ยนแพ็กเกจ
export default function SlotPicker() {
  const [packageCode, setPackageCode] = useState(PACKAGE_OPTIONS[0].code)
  const [slots, setSlots] = useState([])

  useEffect(() => {
    let active = true
    mockGetSlots({ dateFrom: todayISODate(), packageCode }).then((result) => {
      if (active) setSlots(result)
    })
    return () => {
      active = false
    }
  }, [packageCode])

  return (
    <section className="mx-auto max-w-2xl p-6">
      <h2 className="text-xl font-semibold text-teal-800">เลือกแพ็กเกจและช่วงเวลา</h2>

      <label className="mt-4 block text-sm font-medium text-slate-700" htmlFor="package-select">
        แพ็กเกจ
      </label>
      <select
        id="package-select"
        value={packageCode}
        onChange={(e) => setPackageCode(e.target.value)}
        className="mt-1 rounded border border-slate-300 p-2"
      >
        {PACKAGE_OPTIONS.map((pkg) => (
          <option key={pkg.code} value={pkg.code}>
            {pkg.label}
          </option>
        ))}
      </select>

      <ul className="mt-4 space-y-2">
        {slots.map((slot) => (
          <li
            key={`${slot.slot_date}-${slot.start_time}`}
            className="flex justify-between rounded border border-slate-200 p-3"
          >
            <span>
              {slot.slot_date} {slot.start_time}
            </span>
            <span>เหลือ {slot.remaining} ที่</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
