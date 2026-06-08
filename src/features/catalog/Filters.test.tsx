import { it, expect, vi } from 'vitest'
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Filters, type FilterValue } from './Filters'

/** Stateful-обёртка: контролируемый инпут должен реально накапливать ввод. */
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

it('сообщает выбор языка', async () => {
  const onChange = vi.fn()
  render(<Harness onChange={onChange} />)
  await userEvent.selectOptions(screen.getByLabelText(/язык/i), 'russian')
  expect(onChange).toHaveBeenLastCalledWith({ language: 'russian' })
})
