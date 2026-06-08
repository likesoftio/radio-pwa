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

interface Chip { value: string; label: string }

const LANGUAGES: Chip[] = [
  { value: 'russian', label: 'Русский' },
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Español' },
  { value: 'german', label: 'Deutsch' },
  { value: 'french', label: 'Français' }
]

const TAGS: Chip[] = [
  { value: 'pop', label: 'Pop' },
  { value: 'rock', label: 'Rock' },
  { value: 'jazz', label: 'Jazz' },
  { value: 'classical', label: 'Classical' },
  { value: 'talk', label: 'Talk' },
  { value: 'news', label: 'News' }
]

function ChipRow({
  label,
  selected,
  options,
  onSelect
}: {
  label: string
  selected: string
  options: Chip[]
  onSelect: (value: string) => void
}) {
  return (
    <div className="chips" role="group" aria-label={label}>
      <button
        type="button"
        className="chip"
        data-active={selected === ''}
        aria-pressed={selected === ''}
        onClick={() => onSelect('')}
      >
        {ru.filters.all}
      </button>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className="chip"
          data-active={selected === opt.value}
          aria-pressed={selected === opt.value}
          onClick={() => onSelect(selected === opt.value ? '' : opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function Filters({ value, onChange }: Props) {
  return (
    <div className="filters">
      <div className="search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.2-3.2" />
        </svg>
        <input
          type="search"
          placeholder={ru.search.placeholder}
          value={value.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </div>

      <ChipRow label={ru.filters.language} selected={value.language} options={LANGUAGES} onSelect={(v) => onChange({ language: v })} />
      <ChipRow label={ru.filters.tag} selected={value.tag} options={TAGS} onSelect={(v) => onChange({ tag: v })} />
    </div>
  )
}
