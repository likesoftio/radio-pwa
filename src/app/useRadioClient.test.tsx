import { it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useRadioClient } from './useRadioClient'

it('после резолва зеркала отдаёт готовый клиент', async () => {
  const resolve = vi.fn(async () => 'https://de1.api.radio-browser.info')
  const { result } = renderHook(() => useRadioClient(resolve))
  await waitFor(() => expect(result.current.state).toBe('ready'))
  expect(result.current.client).not.toBeNull()
})

it('при ошибке резолва переходит в error', async () => {
  const resolve = vi.fn(async () => { throw new Error('down') })
  const { result } = renderHook(() => useRadioClient(resolve))
  await waitFor(() => expect(result.current.state).toBe('error'))
})
