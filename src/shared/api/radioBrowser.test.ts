import { describe, it, expect, vi } from 'vitest'
import { resolveBaseUrl } from './radioBrowser'

describe('resolveBaseUrl', () => {
  it('возвращает https-адрес первого ответившего сервера', async () => {
    const fetchFn = vi.fn(async (url: string) => {
      if (url.includes('all.api.radio-browser.info')) {
        return new Response(JSON.stringify([{ name: 'de1.api.radio-browser.info' }]), { status: 200 })
      }
      return new Response('ok', { status: 200 })
    })
    const base = await resolveBaseUrl(fetchFn as unknown as typeof fetch)
    expect(base).toBe('https://de1.api.radio-browser.info')
  })

  it('перебирает серверы, если первый недоступен', async () => {
    const fetchFn = vi.fn(async (url: string) => {
      if (url.includes('all.api.radio-browser.info')) {
        return new Response(JSON.stringify([{ name: 'dead.api.radio-browser.info' }, { name: 'live.api.radio-browser.info' }]), { status: 200 })
      }
      if (url.includes('dead')) throw new Error('network')
      return new Response('ok', { status: 200 })
    })
    const base = await resolveBaseUrl(fetchFn as unknown as typeof fetch)
    expect(base).toBe('https://live.api.radio-browser.info')
  })
})
