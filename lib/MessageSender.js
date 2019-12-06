import { ipcRenderer } from 'electron'
import uuid from 'uuid'

export default class MessageSender {
  constructor (requestEvent) {
    this.requestEvent = requestEvent
  }

  send (arg = false) {
    return new Promise((resolve, reject) => {
      try {
        const responseEvent = this.newResponseEvent()
        ipcRenderer.once(responseEvent, (event, response) => {
          resolve(response)
        })
        ipcRenderer.send(this.requestEvent, { responseEvent, arg })
      } catch (err) {
        reject(err)
      }
    })
  }

  newResponseEvent () {
    return `${this.requestEvent}-response-${uuid()}`
  }
}
