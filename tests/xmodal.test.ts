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

// O HMR do Vue mexe direto no elemento que o xModal embrulhou: no rerender (template) reaplica os atributos
// estáticos da raiz, como o style="display: none"; no reload (script ou .ts importado) desmonta a raiz e monta
// uma nova com o mesmo id. Os testes reproduzem essas operações de DOM sem depender do Vue.
describe('xModal com o elemento controlado pelo Vue (HMR)', () => {
  // o MutationObserver entrega os registros em microtask
  const flush = async () => {
    for (let i = 0; i < 3; i++) await Promise.resolve()
  }
  const conteudo = () => document.querySelector('.xModal-modal-content') as HTMLElement
  const wrappers = () => document.querySelectorAll('.xModal-modal-main')
  const overlays = () => document.querySelectorAll('.xModal-widget-overlay')
  const botoes = { ok: { html: 'OK', click: () => {} } }

  // __VUE_HMR_RUNTIME__ é o sinal de que o Vue de desenvolvimento está na página
  let afterHmr = false
  afterEach(() => {
    if (afterHmr) delete (globalThis as any).__VUE_HMR_RUNTIME__
    afterHmr = false
  })

  // o que o Vue faz no reload: tira a raiz antiga e monta a nova com o mesmo id
  const trocarRaiz = (texto: string) => {
    conteudo().remove()
    document.body.insertAdjacentHTML('beforeend', `<div id="${id}" style="display: none"><p class="novo">${texto}</p></div>`)
  }

  it('rerender que reaplica display:none na raiz não esvazia o modal aberto', async () => {
    const modal = new xModal.create({ el: '#' + id, buttons: botoes })
    modal.open()
    conteudo().style.display = 'none'
    await flush()
    expect(conteudo().style.display).toBe('')
  })

  it('rerender que troca a classe da raiz mantém a classe do xModal', async () => {
    const modal = new xModal.create({ el: '#' + id })
    modal.open()
    const el = conteudo()
    el.className = 'outra'
    await flush()
    expect(el.classList.contains('xModal-modal-content')).toBe(true)
    expect(el.classList.contains('outra')).toBe(true)
  })

  it('reload sem novo create: o modal aberto passa para a raiz nova e continua aberto', async () => {
    const onOpen = vi.fn()
    const modal = new xModal.create({ el: '#' + id, title: 'Teste', buttons: botoes, onOpen })
    modal.open({ cod: 7 })
    trocarRaiz('v2')
    await flush()

    expect(wrappers()).toHaveLength(1)
    expect(overlays()).toHaveLength(1)
    const main = wrappers()[0] as HTMLElement
    expect(main.id).toBe(id)
    expect(main.style.display).not.toBe('none')
    expect(main.querySelector('.xModal-modal-content .novo')!.textContent).toBe('v2')
    expect(main.querySelectorAll('.xModal-modal-foot')).toHaveLength(1)
    expect(Object.keys(xModal.dialogs.dialogsOpen)).toEqual([id])
    expect(onOpen).toHaveBeenLastCalledWith({ cod: 7 })

    // a instância que o código guardou continua valendo
    modal.setTitle('Novo título')
    expect(main.querySelector('.xModal-modal-head')!.textContent).toContain('Novo título')
    modal.close()
    vi.advanceTimersByTime(150)
    expect(overlays()).toHaveLength(0)
    expect(main.style.display).toBe('none')
    expect(Object.keys(xModal.dialogs.dialogsOpen)).toEqual([])
  })

  it('reload com create no onMounted: não sobra wrapper velho e o modal novo já abre', async () => {
    ;(globalThis as any).__VUE_HMR_RUNTIME__ = {}
    afterHmr = true
    const modal = new xModal.create({ el: '#' + id, buttons: botoes })
    modal.open()
    trocarRaiz('v2')
    // o onMounted roda no mesmo flush do Vue, antes do MutationObserver
    new xModal.create({ el: '#' + id, buttons: botoes })

    expect(wrappers()).toHaveLength(1)
    expect(overlays()).toHaveLength(1)
    expect(wrappers()[0].querySelector('.novo')!.textContent).toBe('v2')
    expect((wrappers()[0] as HTMLElement).style.display).not.toBe('none')
    await flush()
    expect(wrappers()).toHaveLength(1)
    expect(overlays()).toHaveLength(1)
    expect(Object.keys(xModal.dialogs.dialogsOpen)).toEqual([id])
  })

  it('reload de modal fechado religa sem abrir', async () => {
    const modal = new xModal.create({ el: '#' + id })
    trocarRaiz('v2')
    await flush()
    expect(wrappers()).toHaveLength(1)
    expect((wrappers()[0] as HTMLElement).style.display).toBe('none')
    expect(overlays()).toHaveLength(0)
    modal.open()
    expect(wrappers()[0].querySelector('.novo')).not.toBeNull()
    expect(overlays()).toHaveLength(1)
  })

  it('raiz removida sem substituta (v-if, troca de rota) leva junto o fundo e o registro de aberto', async () => {
    const modal = new xModal.create({ el: '#' + id })
    modal.open()
    conteudo().remove()
    await flush()
    expect(wrappers()).toHaveLength(0)
    expect(overlays()).toHaveLength(0)
    expect(Object.keys(xModal.dialogs.dialogsOpen)).toEqual([])
    expect(document.querySelector('html')!.style.overflow).toBe('')
  })

  it('HMR com o pai inteiro remontado (wrapper fora do documento): o próximo create reabre o modal', () => {
    ;(globalThis as any).__VUE_HMR_RUNTIME__ = {}
    try {
      const modal = new xModal.create({ el: '#' + id })
      modal.open()
      document.body.innerHTML = `<div id="${id}" style="display: none"><p class="novo">v2</p></div>`
      new xModal.create({ el: '#' + id })
      expect(wrappers()).toHaveLength(1)
      expect(overlays()).toHaveLength(1)
      expect(wrappers()[0].querySelector('.novo')).not.toBeNull()
      expect(Object.keys(xModal.dialogs.dialogsOpen)).toEqual([id])
    } finally {
      delete (globalThis as any).__VUE_HMR_RUNTIME__
    }
  })

  it('fora do HMR, a tela que saiu com o modal aberto e voltou não reabre sozinha, mas abre no open', () => {
    const modal = new xModal.create({ el: '#' + id })
    modal.open()
    document.body.innerHTML = `<div id="${id}" style="display: none"><p class="novo">v2</p></div>`
    const novo = new xModal.create({ el: '#' + id })
    expect(wrappers()).toHaveLength(1)
    expect(overlays()).toHaveLength(0)
    expect(Object.keys(xModal.dialogs.dialogsOpen)).toEqual([])
    novo.open()
    expect(overlays()).toHaveLength(1)
  })

  it('o pai inteiro remontado sem novo create: o open da instância guardada usa a raiz nova', () => {
    const modal = new xModal.create({ el: '#' + id })
    document.body.innerHTML = `<div id="${id}" style="display: none"><p class="novo">v2</p></div>`
    modal.open()
    expect(wrappers()).toHaveLength(1)
    expect(overlays()).toHaveLength(1)
    expect(wrappers()[0].querySelector('.novo')).not.toBeNull()
  })

  it('create repetido no mesmo elemento substitui o modal em vez de embrulhar o wrapper', () => {
    new xModal.create({ el: '#' + id, title: 'A' })
    const modal = new xModal.create({ el: '#' + id, title: 'B', buttons: botoes })
    expect(wrappers()).toHaveLength(1)
    expect(wrappers()[0].querySelectorAll('.xModal-modal-head')).toHaveLength(1)
    expect(wrappers()[0].querySelector('.xModal-modal-head')!.textContent).toContain('B')
    expect(document.querySelectorAll('.xModal-modal-content')).toHaveLength(1)
    modal.open()
    expect(overlays()).toHaveLength(1)
  })

  it('destroy para de vigiar o elemento', async () => {
    const modal = new xModal.create({ el: '#' + id })
    modal.destroy()
    const el = document.querySelector('p')!.parentElement as HTMLElement
    el.className = 'outra'
    await flush()
    expect(el.classList.contains('xModal-modal-content')).toBe(false)
  })
})
