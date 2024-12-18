class List {
  constructor(args) {
    this.list = document.createElement(args.tagName || 'ul')

    if (args.atBeginning) {
      args.container.insertBefore(this.list, args.container.children[0])
    } else {
      args.container.appendChild(this.list)
    }

    this.list.setAttribute('id', args.id)
  }

  init(message) {
    this.list.innerHTML = message
  }

  addMessage(message, className, clickEvent) {
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
