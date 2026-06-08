import type { Station } from '../../shared/api/types'

export interface MediaHandlers {
  play: () => void
  pause: () => void
}

/**
 * Обновляет Media Session (заголовок на экране блокировки и кнопки).
 * `MetadataCtor` внедряется для тестируемости; в проде — глобальный MediaMetadata.
 */
export function updateMediaSession(
  nav: Navigator,
  station: Station,
  nowPlaying: string | null,
  handlers: MediaHandlers,
  MetadataCtor: typeof MediaMetadata | undefined = typeof MediaMetadata !== 'undefined' ? MediaMetadata : undefined
): void {
  const ms = nav.mediaSession
  if (!ms || !MetadataCtor) return
  ms.metadata = new MetadataCtor({
    title: nowPlaying || station.name,
    artist: station.name,
    album: station.country,
    artwork: station.favicon ? [{ src: station.favicon, sizes: '512x512' }] : []
  })
  ms.setActionHandler('play', handlers.play)
  ms.setActionHandler('pause', handlers.pause)
}
