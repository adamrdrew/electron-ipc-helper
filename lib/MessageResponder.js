import { ipcMain } from 'electron'

export default class MessageResponder {
  constructor (requestEvent) {
    this.requestEvent = requestEvent
  }

  respond (handler) {
    ipcMain.on(this.requestEvent, (event, response) => {
      this.responseEvent = response.responseEvent
      this.event = event
      this.send(handler(response.arg))
    })
  }

  send (response) {
    this.event.reply(this.responseEvent, response)
  }
}
