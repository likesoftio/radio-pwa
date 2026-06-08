/** Достаёт название трека из произвольного payload станции. null — если данных нет. */
export function extractNowPlaying(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null
  const title = (payload as { title?: unknown }).title
  if (typeof title !== 'string') return null
  const trimmed = title.trim()
  return trimmed.length > 0 ? trimmed : null
}
