class List {
  list: HTMLElement
  constructor(args: {
    atBeginning?: boolean
    container: HTMLElement
    id: string
  }) {
    this.list = document.createElement('ul')

    if (args.atBeginning) {
      args.container.insertBefore(this.list, args.container.children[0])
    } else {
      args.container.appendChild(this.list)
    }

    this.list.setAttribute('id', args.id)
  }

  addMessage(
    message: string,
    className: string,
    clickEvent: (event: MouseEvent) => void,
  ): HTMLLIElement {
    const newMessage = document.createElement('li')

    newMessage.innerHTML = message

    if (className) {
      newMessage.setAttribute('class', className)
    }

    this.list.appendChild(newMessage)

    if (clickEvent) {
      newMessage.addEventListener('click', clickEvent)
    }

    return newMessage
  }
}

export default List
