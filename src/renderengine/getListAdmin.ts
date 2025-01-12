const getListAdmin = (args: {
  container: HTMLElement
  id: string
}): {
  addMessage: (
    message: string,
    className: string,
    clickEvent: (event: MouseEvent) => void,
  ) => HTMLLIElement
  list: HTMLUListElement
} => {
  const list = document.createElement('ul')

  args.container.appendChild(list)

  list.setAttribute('id', args.id)

  return {
    addMessage: (message, className, clickEvent): HTMLLIElement => {
      const newMessage = document.createElement('li')

      newMessage.innerHTML = message

      if (className) {
        newMessage.setAttribute('class', className)
      }

      list.appendChild(newMessage)

      newMessage.addEventListener('click', clickEvent)

      return newMessage
    },
    list,
  }
}

export default getListAdmin
