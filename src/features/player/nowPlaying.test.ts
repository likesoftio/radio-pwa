import { describe, it, expect } from 'vitest'
import { extractNowPlaying } from './nowPlaying'

describe('extractNowPlaying', () => {
  it('возвращает title из корректного JSON', () => {
    expect(extractNowPlaying({ title: 'Artist - Song' })).toBe('Artist - Song')
  })
  it('обрезает пробелы', () => {
    expect(extractNowPlaying({ title: '  Song  ' })).toBe('Song')
  })
  it('возвращает null для пустого/некорректного', () => {
    expect(extractNowPlaying({})).toBeNull()
    expect(extractNowPlaying(null)).toBeNull()
    expect(extractNowPlaying({ title: '   ' })).toBeNull()
  })
})
