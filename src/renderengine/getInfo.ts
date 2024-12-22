import getObjectEntries from '@/lib/getObjectEntries'

const getInfo = (options: {
  showInfos?: boolean
}): {
  change: (name: string, value: string) => void
  logInitTime: (initTime: number) => void
  logRenderTime: (draw: number, fullDuration: number) => void
} => {
  const logs: Record<string, string> = {}

  let initString: string

  const d = document
  const body = d.getElementById('sliders')
  const info = d.createElement('div')

  let show = options.showInfos

  const swap = (): void => {
    if (body === null) {
      return
    }

    if ((show = !show)) {
      body.appendChild(info)
    } else {
      body.removeChild(info)
    }
  }

  const change = (name: string, value: string): void => {
    logs[name] = value
  }

  info.setAttribute('id', 'infos')

  if (show && body !== null) {
    body.appendChild(info)
  }

  document.onkeydown = (event: KeyboardEvent): void => {
    if (event.ctrlKey && event.key.toLocaleLowerCase() === 'i') {
      event.preventDefault()

      swap()
    }
  }

  return {
    change,
    logInitTime: (initTime): void => {
      initString = `<span class='init' style='width:${initTime * 5}px;'>${initTime}ms<br>Init</span>`
    },
    logRenderTime: (draw, fullDuration): void => {
      const render = fullDuration - draw
      const string = []

      if (show) {
        change('Duration', fullDuration + 'ms')

        change('fps', Math.floor(1000 / fullDuration) + 'fps')

        change('Average-Time', 'false')

        getObjectEntries(logs).forEach(([key, value]) => {
          string.push(`<p><strong>${key}:</strong> ${value}</p>`)
        })

        string.push(
          `<p>${initString}<span class='drawing' style='width:${draw * 5}px;'>${draw}ms<br>Drawing</span><span style='width:${render * 5}px;'>${render}ms<br>Render</span></p>`,
        )

        info.innerHTML = string.join('')
      }
    },
  }
}

export default getInfo
