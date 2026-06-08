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

export function StationCard({ station, isCurrent, isPlaying, isFavorite, onPlay, onToggleFavorite }: Props) {
  const playLabel = isCurrent && isPlaying ? ru.player.pause : ru.player.play
  const favLabel = isFavorite ? ru.favorites.remove : ru.favorites.add
  return (
    <div className="station-card" data-current={isCurrent}>
      {station.favicon ? <img src={station.favicon} alt="" width={40} height={40} loading="lazy" /> : <div className="station-card__placeholder" aria-hidden />}
      <div className="station-card__meta">
        <span className="station-card__name">{station.name}</span>
        <span className="station-card__sub">{station.country}{station.tags ? ` · ${station.tags.split(',')[0]}` : ''}</span>
      </div>
      <button type="button" aria-label={playLabel} onClick={() => onPlay(station)}>
        {isCurrent && isPlaying ? '⏸' : '▶'}
      </button>
      <button type="button" aria-label={favLabel} aria-pressed={isFavorite} onClick={() => onToggleFavorite(station)}>
        {isFavorite ? '★' : '☆'}
      </button>
    </div>
  )
}
