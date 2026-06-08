import { useEffect, useRef, useState } from 'react'
import { resolveBaseUrl, createClient, type RadioClient } from '../shared/api/radioBrowser'

type State = 'loading' | 'ready' | 'error'

export function useRadioClient(resolve: typeof resolveBaseUrl = resolveBaseUrl) {
  const [state, setState] = useState<State>('loading')
  const clientRef = useRef<RadioClient | null>(null)
  const [, force] = useState(0)

  useEffect(() => {
    let alive = true
    resolve()
      .then((base) => {
        if (!alive) return
        clientRef.current = createClient(base)
        setState('ready')
        force((n) => n + 1)
      })
      .catch(() => { if (alive) setState('error') })
    return () => { alive = false }
  }, [resolve])

  return { state, client: clientRef.current }
}
