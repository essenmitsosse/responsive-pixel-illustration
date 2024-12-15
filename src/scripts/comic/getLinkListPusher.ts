export const getLinkListPusher = <T>(linkList: Array<T>): ((link: T) => T) =>
  function (link) {
    linkList.push(link)

    return link
  }
