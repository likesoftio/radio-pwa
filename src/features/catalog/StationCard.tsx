import type { Station } from '../../shared/api/types'
import { ru } from '../../i18n/ru'

interface Props {
  station: Station
  isCurrent: boolean
  isPlaying: boolean
  isFavorite: boolean
  onPlay: (station: Station) => void
  onToggleFavorite: (station: Station) => void
}

const WavesGlyph = () => (
  <svg className="card__art-fallback" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <circle cx="24" cy="24" r="4" fill="currentColor" />
    <g stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
      <path d="M31.8 17.6a9 9 0 0 1 0 12.8M16.2 17.6a9 9 0 0 0 0 12.8" />
    </g>
  </svg>
)

const Eq = () => (
  <span className="eq" aria-hidden="true"><i /><i /><i /><i /></span>
)

export function StationCard({ station, isCurrent, isPlaying, isFavorite, onPlay, onToggleFavorite }: Props) {
  const active = isCurrent && isPlaying
  const playLabel = active ? ru.player.pause : ru.player.play
  const favLabel = isFavorite ? ru.favorites.remove : ru.favorites.add
  const firstTag = station.tags ? station.tags.split(',')[0] : ''

  return (
    <article className="card" data-current={isCurrent}>
      <div className="card__art">
        {station.favicon ? <img src={station.favicon} alt="" loading="lazy" /> : <WavesGlyph />}
        {active && (
          <span className="card__art-overlay">
            <Eq />
          </span>
        )}
      </div>

      <div className="card__meta">
        <span className="card__name">{station.name}</span>
        <span className="card__sub">{station.country}{firstTag ? ` · ${firstTag}` : ''}</span>
      </div>

      <button type="button" className="card__play" aria-label={playLabel} onClick={() => onPlay(station)}>
        {active ? (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.2" /><rect x="14" y="5" width="4" height="14" rx="1.2" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5Z" /></svg>
        )}
      </button>

      <button type="button" className="card__fav" aria-label={favLabel} aria-pressed={isFavorite} onClick={() => onToggleFavorite(station)}>
        <svg viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="m12 3.6 2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 17.88l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85Z" strokeLinejoin="round" />
        </svg>
      </button>
    </article>
  )
}
