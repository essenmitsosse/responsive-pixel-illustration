import type { DoHover } from '@/renderengine/helper/typeHover'

const getHoverChangerCustom = (): {
  doHover: DoHover
  push: (value: (args: Record<string, number>) => void) => void
} => {
  const listChangerCustom: Array<(args: Record<string, number>) => void> = []

  return {
    push: listChangerCustom.push.bind(listChangerCustom),
    doHover: (args: Record<string, number>): void =>
      listChangerCustom.forEach((change) => change(args)),
  }
}

export default getHoverChangerCustom
