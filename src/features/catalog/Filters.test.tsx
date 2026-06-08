import { it, expect, vi } from 'vitest'
import { useState } from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Filters, type FilterValue } from './Filters'

/** Stateful-обёртка: контролируемые поля должны реально обновляться. */
function Harness({ onChange }: { onChange: (v: Partial<FilterValue>) => void }) {
  const [value, setValue] = useState<FilterValue>({ name: '', country: '', language: '', tag: '' })
  return (
    <Filters
      value={value}
      onChange={(partial) => {
        setValue((prev) => ({ ...prev, ...partial }))
        onChange(partial)
      }}
    />
  )
}

it('сообщает изменение текста поиска', async () => {
  const onChange = vi.fn()
  render(<Harness onChange={onChange} />)
  await userEvent.type(screen.getByPlaceholderText(/поиск станции/i), 'jazz')
  expect(onChange).toHaveBeenLastCalledWith({ name: 'jazz' })
})

it('сообщает выбор языка по чипу', async () => {
  const onChange = vi.fn()
  render(<Harness onChange={onChange} />)
  const group = screen.getByRole('group', { name: /язык/i })
  await userEvent.click(within(group).getByRole('button', { name: 'Русский' }))
  expect(onChange).toHaveBeenLastCalledWith({ language: 'russian' })
})

it('повторный клик по активному чипу сбрасывает фильтр', async () => {
  const onChange = vi.fn()
  render(<Harness onChange={onChange} />)
  const group = screen.getByRole('group', { name: /жанр/i })
  const jazz = within(group).getByRole('button', { name: 'Jazz' })
  await userEvent.click(jazz)
  expect(onChange).toHaveBeenLastCalledWith({ tag: 'jazz' })
  await userEvent.click(jazz)
  expect(onChange).toHaveBeenLastCalledWith({ tag: '' })
})
