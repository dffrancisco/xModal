import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import xModal from '../index.ts'

let n = 0
let id = ''

beforeEach(() => {
  vi.useFakeTimers()
  id = 'modal' + ++n
  document.body.innerHTML = `<div id="${id}"><p>conteúdo</p></div>`
})

afterEach(() => {
  // fecha o que ficou aberto para não vazar entre os testes
  for (const k of Object.keys(xModal.dialogs.dialogsOpen)) delete xModal.dialogs.dialogsOpen[k]
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

const esc = () =>
  document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 27, bubbles: true } as any))

describe('xModal', () => {
  it('open mostra o modal com overlay e close esconde e remove o overlay', () => {
    const modal = new xModal.create({ el: '#' + id, title: 'Teste' })
    modal.open()
    expect(document.getElementById(id + '_Modal')).not.toBeNull()

    modal.close()
    vi.advanceTimersByTime(150)
    expect(document.getElementById(id + '_Modal')).toBeNull()
    expect(Object.keys(xModal.dialogs.dialogsOpen)).not.toContain(id)
  })

  it('Esc fecha o modal do topo e chama onClose', () => {
    const onClose = vi.fn()
    const modal = new xModal.create({ el: '#' + id, onClose })
    modal.open()
    esc()
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(document.getElementById(id + '_Modal')).toBeNull()
  })

  it('fechar depois do overlay já removido não lança erro', () => {
    const modal = new xModal.create({ el: '#' + id })
    modal.open()
    esc()
    modal.close()
    expect(() => vi.advanceTimersByTime(150)).not.toThrow()
  })

  it('teclas com o modal aberto não escrevem no console', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const modal = new xModal.create({ el: '#' + id, onKeyDown: { F2: () => {} } })
    modal.open()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'F2', keyCode: 113, bubbles: true } as any))
    expect(log).not.toHaveBeenCalled()
  })

  it.each(['xModal-xAtila', 'xModal-xAtila-dark', 'xModal-Vyzo'])(
    'aceita o tema %s em theme: e aplica no modal e no overlay',
    (theme) => {
      const modal = new xModal.create({ el: '#' + id, theme } as any)
      modal.open()
      expect(document.querySelector('.xModal-modal-main')!.classList.contains(theme)).toBe(true)
      expect(document.getElementById(id + '_Modal')!.classList.contains(theme)).toBe(true)
    },
  )

  it('tema inválido continua sendo recusado', () => {
    expect(() => new xModal.create({ el: '#' + id, theme: 'nao-existe' } as any)).toThrow()
  })
})
