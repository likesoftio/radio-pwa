import { useEffect } from 'react'
import { usePlayer } from './playerStore'
import { updateMediaSession } from './mediaSession'

export function usePlayerEffects(): void {
  const audio = usePlayer((s) => s.audio)
  const current = usePlayer((s) => s.current)
  const nowPlaying = usePlayer((s) => s.nowPlaying)

  useEffect(() => {
    const onPlaying = () => usePlayer.getState().onPlaying()
    const onWaiting = () => usePlayer.setState({ status: 'buffering' })
    const onError = () => usePlayer.getState().onError()
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('stalled', onWaiting)
    audio.addEventListener('error', onError)
    return () => {
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('stalled', onWaiting)
      audio.removeEventListener('error', onError)
    }
  }, [audio])

  useEffect(() => {
    if (!current || typeof navigator === 'undefined') return
    updateMediaSession(navigator, current, nowPlaying, {
      play: () => void usePlayer.getState().toggle(),
      pause: () => usePlayer.getState().pause()
    })
  }, [current, nowPlaying])
}
