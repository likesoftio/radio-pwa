import { useEffect, useRef, useState, useCallback } from 'react'
import type { RadioClient } from '../../shared/api/radioBrowser'
import type { Station } from '../../shared/api/types'
import type { FilterValue } from './Filters'

const EMPTY: FilterValue = { name: '', country: '', language: '', tag: '' }

export function useCatalog(client: RadioClient, debounceMs = 400) {
  const [filters, setFiltersState] = useState<FilterValue>(EMPTY)
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setFilters = useCallback((partial: Partial<FilterValue>) => {
    setFiltersState((prev) => ({ ...prev, ...partial }))
  }, [])

  useEffect(() => {
    const hasQuery = filters.name || filters.country || filters.language || filters.tag
    const run = async () => {
      setLoading(true)
      setError(false)
      try {
        const list = hasQuery
          ? await client.searchStations({ name: filters.name, country: filters.country, language: filters.language, tag: filters.tag, limit: 50 })
          : await client.topStations(50)
        setStations(list)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(run, debounceMs)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [client, debounceMs, filters.name, filters.country, filters.language, filters.tag])

  return { stations, loading, error, filters, setFilters }
}
