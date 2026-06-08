import { create } from 'zustand'
import type { Station } from '../../shared/api/types'

export type PlayerStatus = 'idle' | 'buffering' | 'playing' | 'error'

interface PlayerState {
  audio: HTMLAudioElement
  current: Station | null
  status: PlayerStatus
  nowPlaying: string | null
  play: (station: Station) => Promise<void>
  pause: () => void
  toggle: () => Promise<void>
  retry: () => Promise<void>
  onPlaying: () => void
  onError: () => void
  setNowPlaying: (title: string | null) => void
  __setAudio: (audio: HTMLAudioElement) => void
}

function createAudio(): HTMLAudioElement {
  // jsdom умеет создавать элемент, но не проигрывает — для тестов заменяется через __setAudio.
  return typeof Audio !== 'undefined' ? new Audio() : ({} as HTMLAudioElement)
}

export const usePlayer = create<PlayerState>((set, get) => ({
  audio: createAudio(),
  current: null,
  status: 'idle',
  nowPlaying: null,

  play: async (station) => {
    const { audio } = get()
    audio.src = station.url_resolved || station.url
    set({ current: station, status: 'buffering', nowPlaying: null })
    try {
      await audio.play()
    } catch {
      set({ status: 'error' })
    }
  },

  pause: () => {
    get().audio.pause()
    set({ status: 'idle' })
  },

  toggle: async () => {
    const { status, current, play, pause } = get()
    if (!current) return
    if (status === 'playing' || status === 'buffering') pause()
    else await play(current)
  },

  retry: async () => {
    const { current, play } = get()
    if (current) await play(current)
  },

  onPlaying: () => set({ status: 'playing' }),
  onError: () => set({ status: 'error' }),
  setNowPlaying: (title) => set({ nowPlaying: title }),
  __setAudio: (audio) => set({ audio })
}))
