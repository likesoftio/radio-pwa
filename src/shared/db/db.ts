import Dexie, { type Table } from 'dexie'
import type { Station } from '../api/types'

export interface FavoriteRow extends Station {
  addedAt: number
}

class RadioDB extends Dexie {
  favorites!: Table<FavoriteRow, string>

  constructor() {
    super('radio-pwa')
    this.version(1).stores({
      favorites: 'stationuuid, addedAt'
    })
  }
}

export const db = new RadioDB()

export async function addFavorite(station: Station): Promise<void> {
  await db.favorites.put({ ...station, addedAt: nextTimestamp() })
}

export async function removeFavorite(stationuuid: string): Promise<void> {
  await db.favorites.delete(stationuuid)
}

export async function listFavorites(): Promise<FavoriteRow[]> {
  return db.favorites.orderBy('addedAt').reverse().toArray()
}

export async function isFavorite(stationuuid: string): Promise<boolean> {
  return (await db.favorites.get(stationuuid)) !== undefined
}

// Обёртка над Date.now для тестируемости; в проде — реальное время.
function nextTimestamp(): number {
  return Date.now()
}
