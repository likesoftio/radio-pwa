import { describe, it, expect, vi } from 'vitest'
import { resolveBaseUrl, createClient } from './radioBrowser'

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

describe('createClient.searchStations', () => {
  it('строит URL с фильтрами и возвращает станции', async () => {
    const fetchFn = vi.fn(async (_url: string) =>
      new Response(JSON.stringify([{ stationuuid: '1', name: 'Эхо', url: '', url_resolved: 'http://s/1', favicon: '', country: 'Russia', countrycode: 'RU', language: 'russian', tags: 'talk', codec: 'MP3', bitrate: 128 }]), { status: 200 })
    )
    const client = createClient('https://de1.api.radio-browser.info', fetchFn as unknown as typeof fetch)
    const list = await client.searchStations({ name: 'Эхо', country: 'Russia', limit: 20 })
    expect(list).toHaveLength(1)
    expect(list[0].url_resolved).toBe('http://s/1')
    const calledUrl = (fetchFn.mock.calls[0][0] as string)
    expect(calledUrl).toContain('/json/stations/search')
    expect(calledUrl).toContain('name=%D0%AD%D1%85%D0%BE')
    expect(calledUrl).toContain('country=Russia')
    expect(calledUrl).toContain('hidebroken=true')
  })
})
