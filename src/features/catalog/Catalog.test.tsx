import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Catalog } from './Catalog'
import { db } from '../../shared/db/db'
import type { RadioClient } from '../../shared/api/radioBrowser'
import type { Station } from '../../shared/api/types'

const station: Station = {
  stationuuid: 'abc', name: 'Эхо', url: '', url_resolved: 'http://s/1',
  favicon: '', country: 'Russia', countrycode: 'RU', language: 'russian',
  tags: 'talk', codec: 'MP3', bitrate: 128
}

const client: RadioClient = {
  topStations: vi.fn(async () => [station]),
  searchStations: vi.fn(async () => [station])
}

describe('Catalog', () => {
  beforeEach(async () => { await db.favorites.clear() })

  it('рендерит станции из клиента', async () => {
    render(<Catalog client={client} currentId={null} isPlaying={false} onPlay={() => {}} />)
    expect(await screen.findByText('Эхо')).toBeInTheDocument()
  })
})
