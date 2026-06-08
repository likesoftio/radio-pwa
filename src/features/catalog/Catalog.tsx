import { useLiveQuery } from 'dexie-react-hooks'
import { Filters } from './Filters'
import { StationCard } from './StationCard'
import { useCatalog } from './useCatalog'
import { listFavorites, addFavorite, removeFavorite } from '../../shared/db/db'
import type { RadioClient } from '../../shared/api/radioBrowser'
import type { Station } from '../../shared/api/types'
import { ru } from '../../i18n/ru'

interface Props {
  client: RadioClient
  currentId: string | null
  isPlaying: boolean
  onPlay: (station: Station) => void
}

export function Catalog({ client, currentId, isPlaying, onPlay }: Props) {
  const { stations, loading, error, filters, setFilters } = useCatalog(client)
  const favorites = useLiveQuery(() => listFavorites(), [], [])
  const favIds = new Set(favorites.map((f) => f.stationuuid))

  const toggleFavorite = async (s: Station) => {
    if (favIds.has(s.stationuuid)) await removeFavorite(s.stationuuid)
    else await addFavorite(s)
  }

  return (
    <div className="catalog">
      <Filters value={filters} onChange={setFilters} />
      {loading && <p className="status">{ru.player.buffering}</p>}
      {error && <p className="status">{ru.net.offline}</p>}
      {!loading && !error && stations.length === 0 && <p className="status">{ru.search.empty}</p>}
      <div className="station-list">
        {stations.map((s) => (
          <StationCard
            key={s.stationuuid}
            station={s}
            isCurrent={s.stationuuid === currentId}
            isPlaying={isPlaying}
            isFavorite={favIds.has(s.stationuuid)}
            onPlay={onPlay}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </div>
  )
}
