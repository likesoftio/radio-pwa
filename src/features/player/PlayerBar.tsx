import { usePlayer } from './playerStore'
import { ru } from '../../i18n/ru'

export function PlayerBar() {
  const current = usePlayer((s) => s.current)
  const status = usePlayer((s) => s.status)
  const nowPlaying = usePlayer((s) => s.nowPlaying)
  const toggle = usePlayer((s) => s.toggle)
  const retry = usePlayer((s) => s.retry)

  if (!current) return null

  const isActive = status === 'playing' || status === 'buffering'

  return (
    <div className="player-bar" role="region" aria-label="Плеер">
      <div className="player-bar__meta">
        <span className="player-bar__name">{current.name}</span>
        <span className="player-bar__sub">
          {status === 'buffering' ? ru.player.buffering : nowPlaying || ru.nowPlaying.unknown}
        </span>
      </div>
      {status === 'error' ? (
        <button type="button" aria-label={ru.player.retry} onClick={() => void retry()}>↻</button>
      ) : (
        <button type="button" aria-label={isActive ? ru.player.pause : ru.player.play} onClick={() => void toggle()}>
          {isActive ? '⏸' : '▶'}
        </button>
      )}
    </div>
  )
}
