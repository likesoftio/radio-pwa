import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Favorites } from './Favorites'
import { db, addFavorite } from '../../shared/db/db'
import type { Station } from '../../shared/api/types'

const station: Station = {
  stationuuid: 'abc', name: 'Эхо', url: '', url_resolved: 'http://s/1',
  favicon: '', country: 'Russia', countrycode: 'RU', language: 'russian',
  tags: 'talk', codec: 'MP3', bitrate: 128
}

const noop = () => {}

describe('Favorites', () => {
  beforeEach(async () => { await db.favorites.clear() })

  it('показывает пустое состояние', async () => {
    render(<Favorites currentId={null} isPlaying={false} onPlay={noop} onToggleFavorite={noop} />)
    expect(await screen.findByText(/пока нет избранных/i)).toBeInTheDocument()
  })

  it('показывает добавленную станцию', async () => {
    await addFavorite(station)
    render(<Favorites currentId={null} isPlaying={false} onPlay={noop} onToggleFavorite={noop} />)
    expect(await screen.findByText('Эхо')).toBeInTheDocument()
  })
})
