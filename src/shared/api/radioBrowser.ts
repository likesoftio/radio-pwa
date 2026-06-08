import type { Station, SearchParams } from './types'

const SERVERS_URL = 'https://all.api.radio-browser.info/json/servers'

interface ServerEntry { name: string }

/** Получить список серверов и вернуть базовый URL первого ответившего. */
export async function resolveBaseUrl(fetchFn: typeof fetch = fetch): Promise<string> {
  const res = await fetchFn(SERVERS_URL)
  const servers = (await res.json()) as ServerEntry[]
  const names = [...new Set(servers.map((s) => s.name))]
  for (const name of names) {
    const base = `https://${name}`
    try {
      const ping = await fetchFn(`${base}/json/stats`)
      if (ping.ok) return base
    } catch {
      // пробуем следующий сервер
    }
  }
  throw new Error('No radio-browser server available')
}

export interface RadioClient {
  searchStations(params: SearchParams): Promise<Station[]>
  topStations(limit?: number): Promise<Station[]>
}

export function createClient(baseUrl: string, fetchFn: typeof fetch = fetch): RadioClient {
  async function get(path: string, query: Record<string, string | number | undefined>): Promise<Station[]> {
    const qs = new URLSearchParams({ hidebroken: 'true' })
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== '') qs.set(k, String(v))
    }
    const res = await fetchFn(`${baseUrl}${path}?${qs.toString()}`, { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`radio-browser ${res.status}`)
    return (await res.json()) as Station[]
  }

  return {
    searchStations: (p) =>
      get('/json/stations/search', {
        name: p.name,
        country: p.country,
        language: p.language,
        tag: p.tag,
        limit: p.limit ?? 30,
        offset: p.offset ?? 0,
        order: 'clickcount',
        reverse: 'true'
      }),
    topStations: (limit = 30) =>
      get('/json/stations/topclick', { limit })
  }
}
