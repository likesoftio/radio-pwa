import { ru } from '../../i18n/ru'

export interface FilterValue {
  name: string
  country: string
  language: string
  tag: string
}

interface Props {
  value: FilterValue
  onChange: (partial: Partial<FilterValue>) => void
}

const LANGUAGES = ['', 'russian', 'english', 'spanish', 'german', 'french']
const TAGS = ['', 'pop', 'rock', 'jazz', 'classical', 'talk', 'news']

export function Filters({ value, onChange }: Props) {
  return (
    <div className="filters">
      <input
        type="search"
        placeholder={ru.search.placeholder}
        value={value.name}
        onChange={(e) => onChange({ name: e.target.value })}
      />
      <label>
        {ru.filters.language}
        <select value={value.language} onChange={(e) => onChange({ language: e.target.value })}>
          {LANGUAGES.map((l) => <option key={l} value={l}>{l || ru.filters.all}</option>)}
        </select>
      </label>
      <label>
        {ru.filters.tag}
        <select value={value.tag} onChange={(e) => onChange({ tag: e.target.value })}>
          {TAGS.map((t) => <option key={t} value={t}>{t || ru.filters.all}</option>)}
        </select>
      </label>
    </div>
  )
}
