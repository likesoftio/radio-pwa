import { usePlayer } from './playerStore'
import { ru } from '../../i18n/ru'

const WavesGlyph = () => (
  <svg className="player__art-fallback" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <circle cx="24" cy="24" r="4" fill="currentColor" />
    <g stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
      <path d="M31.8 17.6a9 9 0 0 1 0 12.8M16.2 17.6a9 9 0 0 0 0 12.8" />
    </g>
  </svg>
)

export function PlayerBar() {
  const current = usePlayer((s) => s.current)
  const status = usePlayer((s) => s.status)
  const nowPlaying = usePlayer((s) => s.nowPlaying)
  const toggle = usePlayer((s) => s.toggle)
  const retry = usePlayer((s) => s.retry)

  if (!current) return null

  const isActive = status === 'playing' || status === 'buffering'
  const playing = status === 'playing'

  return (
    <div className="player" role="region" aria-label="Плеер" data-status={status}>
      <div className="player__art">
        {current.favicon ? <img src={current.favicon} alt="" /> : <WavesGlyph />}
        {playing && <span className="eq" aria-hidden="true"><i /><i /><i /><i /></span>}
      </div>

      <div className="player__meta">
        <span className="player__name">{current.name}</span>
        <span className="player__sub">
          {status === 'buffering' ? ru.player.buffering : status === 'error' ? ru.player.error : nowPlaying || ru.nowPlaying.unknown}
        </span>
      </div>

      {status === 'error' ? (
        <button type="button" className="player__btn" aria-label={ru.player.retry} onClick={() => void retry()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v5h-5" />
          </svg>
        </button>
      ) : (
        <button type="button" className="player__btn" aria-label={isActive ? ru.player.pause : ru.player.play} onClick={() => void toggle()}>
          {isActive ? (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.2" /><rect x="14" y="5" width="4" height="14" rx="1.2" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5Z" /></svg>
          )}
        </button>
      )}
    </div>
  )
}
