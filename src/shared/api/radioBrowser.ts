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
