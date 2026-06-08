import { describe, it, expect, vi } from 'vitest'
import { updateMediaSession } from './mediaSession'
import type { Station } from '../../shared/api/types'

const station: Station = {
  stationuuid: 'abc', name: 'Эхо', url: '', url_resolved: 'http://s/1',
  favicon: 'http://s/fav.png', country: 'Russia', countrycode: 'RU', language: 'russian',
  tags: 'talk', codec: 'MP3', bitrate: 128
}

describe('updateMediaSession', () => {
  it('пишет метаданные и вешает обработчики play/pause', () => {
    const setActionHandler = vi.fn()
    const nav = { mediaSession: { metadata: null, setActionHandler } } as unknown as Navigator
    const handlers = { play: vi.fn(), pause: vi.fn() }
    updateMediaSession(nav, station, 'Эфир', handlers, class { constructor(public init: unknown) {} } as unknown as typeof MediaMetadata)
    expect((nav.mediaSession.metadata as unknown as { init: { title: string } }).init.title).toBe('Эфир')
    expect(setActionHandler).toHaveBeenCalledWith('play', handlers.play)
    expect(setActionHandler).toHaveBeenCalledWith('pause', handlers.pause)
  })

  it('не падает, если mediaSession отсутствует', () => {
    expect(() => updateMediaSession({} as Navigator, station, null, { play: () => {}, pause: () => {} })).not.toThrow()
  })
})
