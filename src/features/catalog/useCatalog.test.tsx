import { it, expect, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useCatalog } from './useCatalog'
import type { RadioClient } from '../../shared/api/radioBrowser'
import type { Station } from '../../shared/api/types'

const station: Station = {
  stationuuid: 'abc', name: 'Эхо', url: '', url_resolved: 'http://s/1',
  favicon: '', country: 'Russia', countrycode: 'RU', language: 'russian',
  tags: 'talk', codec: 'MP3', bitrate: 128
}

function fakeClient(): RadioClient {
  return {
    topStations: vi.fn(async () => [station]),
    searchStations: vi.fn(async () => [station])
  }
}

it('грузит топ-станции при старте', async () => {
  const client = fakeClient()
  const { result } = renderHook(() => useCatalog(client, 0))
  await waitFor(() => expect(result.current.stations).toHaveLength(1))
  expect(client.topStations).toHaveBeenCalled()
})

it('по фильтру вызывает searchStations', async () => {
  const client = fakeClient()
  const { result } = renderHook(() => useCatalog(client, 0))
  await waitFor(() => expect(result.current.stations).toHaveLength(1))
  act(() => result.current.setFilters({ name: 'jazz' }))
  await waitFor(() => expect(client.searchStations).toHaveBeenCalledWith(expect.objectContaining({ name: 'jazz' })))
})
