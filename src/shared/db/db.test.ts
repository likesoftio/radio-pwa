import { describe, it, expect, beforeEach } from 'vitest'
import { db, addFavorite, removeFavorite, listFavorites, isFavorite } from './db'
import type { Station } from '../api/types'

const station: Station = {
  stationuuid: 'abc', name: 'Эхо', url: '', url_resolved: 'http://s/1',
  favicon: '', country: 'Russia', countrycode: 'RU', language: 'russian',
  tags: 'talk', codec: 'MP3', bitrate: 128
}

describe('favorites db', () => {
  beforeEach(async () => {
    await db.favorites.clear()
  })

  it('добавляет станцию в избранное и читает обратно', async () => {
    await addFavorite(station)
    expect(await isFavorite('abc')).toBe(true)
    const all = await listFavorites()
    expect(all.map((s) => s.stationuuid)).toEqual(['abc'])
  })

  it('повторное добавление не создаёт дубликат', async () => {
    await addFavorite(station)
    await addFavorite(station)
    expect(await listFavorites()).toHaveLength(1)
  })

  it('удаляет станцию из избранного', async () => {
    await addFavorite(station)
    await removeFavorite('abc')
    expect(await isFavorite('abc')).toBe(false)
    expect(await listFavorites()).toHaveLength(0)
  })
})
