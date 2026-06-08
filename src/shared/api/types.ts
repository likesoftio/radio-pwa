/** Станция в формате radio-browser API (только нужные поля). */
export interface Station {
  stationuuid: string
  name: string
  url: string
  url_resolved: string
  favicon: string
  country: string
  countrycode: string
  language: string
  tags: string
  codec: string
  bitrate: number
}

export interface SearchParams {
  name?: string
  country?: string
  language?: string
  tag?: string
  limit?: number
  offset?: number
}
