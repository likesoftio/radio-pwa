import { useState } from 'react'
import { Catalog } from '../features/catalog/Catalog'
import { Favorites } from '../features/favorites/Favorites'
import { PlayerBar } from '../features/player/PlayerBar'
import { usePlayer } from '../features/player/playerStore'
import { usePlayerEffects } from '../features/player/usePlayerEffects'
import { useRadioClient } from './useRadioClient'
import { addFavorite, removeFavorite, isFavorite } from '../shared/db/db'
import type { Station } from '../shared/api/types'
import { ru } from '../i18n/ru'
import './App.css'

type Tab = 'catalog' | 'favorites'

export function App() {
  usePlayerEffects()
  const { state, client } = useRadioClient()
  const [tab, setTab] = useState<Tab>('catalog')
  const current = usePlayer((s) => s.current)
  const status = usePlayer((s) => s.status)
  const play = usePlayer((s) => s.play)
  const isPlaying = status === 'playing' || status === 'buffering'

  const onPlay = (s: Station) => void play(s)
  const onToggleFavorite = async (s: Station) => {
    if (await isFavorite(s.stationuuid)) await removeFavorite(s.stationuuid)
    else await addFavorite(s)
  }

  return (
    <div className="app">
      <nav className="tabs">
        <button type="button" aria-pressed={tab === 'catalog'} onClick={() => setTab('catalog')}>{ru.tabs.catalog}</button>
        <button type="button" aria-pressed={tab === 'favorites'} onClick={() => setTab('favorites')}>{ru.tabs.favorites}</button>
      </nav>

      <main className="content">
        {tab === 'catalog' && state === 'ready' && client && (
          <Catalog client={client} currentId={current?.stationuuid ?? null} isPlaying={isPlaying} onPlay={onPlay} />
        )}
        {tab === 'catalog' && state === 'loading' && <p className="status">{ru.player.buffering}</p>}
        {tab === 'catalog' && state === 'error' && <p className="status">{ru.net.offline}</p>}
        {tab === 'favorites' && (
          <Favorites currentId={current?.stationuuid ?? null} isPlaying={isPlaying} onPlay={onPlay} onToggleFavorite={onToggleFavorite} />
        )}
      </main>

      <PlayerBar />
    </div>
  )
}
