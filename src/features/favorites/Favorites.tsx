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
    return <p className="empty">{ru.favorites.empty}</p>
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
