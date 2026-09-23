// ยืนยัน 'เสร็จเมื่อ' ของ T-18: แสดงช่วงเวลา+ที่นั่งคงเหลือจาก API จำลอง และโหลดใหม่เมื่อเปลี่ยนแพ็กเกจ
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, test, expect } from 'vitest'

vi.mock('../api/client.js', () => ({
  mockGetSlots: vi.fn(({ packageCode }) =>
    Promise.resolve([
      { slot_date: '2569-09-24', start_time: '09:00', package_code: packageCode, remaining: packageCode === 'PKG-GENERAL' ? 5 : 2 },
    ]),
  ),
}))

import SlotPicker from '../pages/SlotPicker.jsx'
import { mockGetSlots } from '../api/client.js'

test('T-18 แสดงช่วงเวลาและที่นั่งคงเหลือจาก API จำลอง', async () => {
  render(<SlotPicker />)

  await waitFor(() => screen.getByText(/เหลือ 5 ที่/))
  expect(screen.getByText(/2569-09-24 09:00/)).toBeTruthy()
})

test('T-18 โหลดช่วงเวลาใหม่เมื่อเปลี่ยนแพ็กเกจ', async () => {
  render(<SlotPicker />)
  await waitFor(() => screen.getByText(/เหลือ 5 ที่/))

  fireEvent.change(screen.getByLabelText('แพ็กเกจ'), { target: { value: 'PKG-SENIOR' } })

  await waitFor(() => screen.getByText(/เหลือ 2 ที่/))
  expect(mockGetSlots).toHaveBeenCalledWith(expect.objectContaining({ packageCode: 'PKG-SENIOR' }))
})
