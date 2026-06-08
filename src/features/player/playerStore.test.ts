import { describe, it, expect, beforeEach, vi } from 'vitest'
import { usePlayer } from './playerStore'
import type { Station } from '../../shared/api/types'

const station: Station = {
  stationuuid: 'abc', name: 'Эхо', url: '', url_resolved: 'http://s/1',
  favicon: '', country: 'Russia', countrycode: 'RU', language: 'russian',
  tags: 'talk', codec: 'MP3', bitrate: 128
}

function fakeAudio() {
  return {
    src: '',
    play: vi.fn(async () => {}),
    pause: vi.fn(),
    load: vi.fn()
  } as unknown as HTMLAudioElement
}

describe('playerStore', () => {
  beforeEach(() => {
    usePlayer.getState().__setAudio(fakeAudio())
    usePlayer.setState({ current: null, status: 'idle', nowPlaying: null })
  })

  it('play устанавливает src и переходит в buffering', async () => {
    await usePlayer.getState().play(station)
    const s = usePlayer.getState()
    expect(s.current?.stationuuid).toBe('abc')
    expect(s.status).toBe('buffering')
    expect(s.audio.src).toBe('http://s/1')
  })

  it('pause переводит в idle и вызывает audio.pause', async () => {
    await usePlayer.getState().play(station)
    usePlayer.getState().pause()
    expect(usePlayer.getState().status).toBe('idle')
    expect(usePlayer.getState().audio.pause).toHaveBeenCalled()
  })

  it('onPlaying переводит в playing, onError — в error', () => {
    usePlayer.getState().onPlaying()
    expect(usePlayer.getState().status).toBe('playing')
    usePlayer.getState().onError()
    expect(usePlayer.getState().status).toBe('error')
  })
})
