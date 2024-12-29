import type { DoHover } from '@/helper/typeHover'

const getHoverChangerCustom = (): {
  doHover: DoHover
  push: (value: DoHover) => void
} => {
  const listChangerCustom: Array<DoHover> = []

  return {
    push: listChangerCustom.push.bind(listChangerCustom),
    doHover: (args): void =>
      listChangerCustom.forEach((change) => change(args)),
  }
}

export default getHoverChangerCustom
