import { useLiveQuery } from 'dexie-react-hooks'
import { listFavorites } from '../../shared/db/db'
import { StationCard } from '../catalog/StationCard'
import type { Station } from '../../shared/api/types'
import { ru } from '../../i18n/ru'

interface Props {
  currentId: string | null
  isPlaying: boolean
  onPlay: (station: Station) => void
  onToggleFavorite: (station: Station) => void
}

export function Favorites({ currentId, isPlaying, onPlay, onToggleFavorite }: Props) {
  const favorites = useLiveQuery(() => listFavorites(), [], [])
  if (favorites.length === 0) {
    return (
      <div className="empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
          <path d="m12 3.6 2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 17.88l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85Z" />
        </svg>
        <span>{ru.favorites.empty}</span>
      </div>
    )
  }
  return (
    <div className="station-list">
      {favorites.map((s) => (
        <StationCard
          key={s.stationuuid}
          station={s}
          isCurrent={s.stationuuid === currentId}
          isPlaying={isPlaying}
          isFavorite
          onPlay={onPlay}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}
