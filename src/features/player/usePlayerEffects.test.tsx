import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePlayerEffects } from './usePlayerEffects'
import { usePlayer } from './playerStore'

function fakeAudio() {
  const listeners: Record<string, EventListener> = {}
  return {
    src: '',
    play: vi.fn(async () => {}),
    pause: vi.fn(),
    addEventListener: (type: string, cb: EventListener) => { listeners[type] = cb },
    removeEventListener: (type: string) => { delete listeners[type] },
    __emit: (type: string) => listeners[type]?.(new Event(type))
  } as unknown as HTMLAudioElement & { __emit: (t: string) => void }
}

describe('usePlayerEffects', () => {
  let audio: ReturnType<typeof fakeAudio>
  beforeEach(() => {
    audio = fakeAudio()
    usePlayer.getState().__setAudio(audio)
    usePlayer.setState({ current: null, status: 'idle', nowPlaying: null })
  })

  it('событие playing переводит стор в playing', () => {
    renderHook(() => usePlayerEffects())
    audio.__emit('playing')
    expect(usePlayer.getState().status).toBe('playing')
  })

  it('событие error переводит стор в error', () => {
    renderHook(() => usePlayerEffects())
    audio.__emit('error')
    expect(usePlayer.getState().status).toBe('error')
  })
})
