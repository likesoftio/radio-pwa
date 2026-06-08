import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PlayerBar } from './PlayerBar'
import { usePlayer } from './playerStore'
import type { Station } from '../../shared/api/types'

const station: Station = {
  stationuuid: 'abc', name: 'Эхо', url: '', url_resolved: 'http://s/1',
  favicon: '', country: 'Russia', countrycode: 'RU', language: 'russian',
  tags: 'talk', codec: 'MP3', bitrate: 128
}

describe('PlayerBar', () => {
  beforeEach(() => {
    usePlayer.setState({ current: null, status: 'idle', nowPlaying: null })
  })

  it('ничего не рендерит без станции', () => {
    const { container } = render(<PlayerBar />)
    expect(container).toBeEmptyDOMElement()
  })

  it('показывает имя станции и nowPlaying', () => {
    usePlayer.setState({ current: station, status: 'playing', nowPlaying: 'Artist - Song' })
    render(<PlayerBar />)
    expect(screen.getByText('Эхо')).toBeInTheDocument()
    expect(screen.getByText('Artist - Song')).toBeInTheDocument()
  })

  it('в состоянии error показывает кнопку повтора', () => {
    usePlayer.setState({ current: station, status: 'error', nowPlaying: null })
    render(<PlayerBar />)
    expect(screen.getByRole('button', { name: /повторить/i })).toBeInTheDocument()
  })
})
