import { it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StationCard } from './StationCard'
import type { Station } from '../../shared/api/types'

const station: Station = {
  stationuuid: 'abc', name: 'Эхо', url: '', url_resolved: 'http://s/1',
  favicon: '', country: 'Russia', countrycode: 'RU', language: 'russian',
  tags: 'talk', codec: 'MP3', bitrate: 128
}

it('рендерит имя и страну, дергает onPlay по клику', async () => {
  const onPlay = vi.fn()
  render(<StationCard station={station} isCurrent={false} isPlaying={false} isFavorite={false} onPlay={onPlay} onToggleFavorite={() => {}} />)
  expect(screen.getByText('Эхо')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: /играть/i }))
  expect(onPlay).toHaveBeenCalledWith(station)
})

it('дергает onToggleFavorite по клику на звезду', async () => {
  const onToggleFavorite = vi.fn()
  render(<StationCard station={station} isCurrent={false} isPlaying={false} isFavorite={false} onPlay={() => {}} onToggleFavorite={onToggleFavorite} />)
  await userEvent.click(screen.getByRole('button', { name: /в избранное/i }))
  expect(onToggleFavorite).toHaveBeenCalledWith(station)
})
