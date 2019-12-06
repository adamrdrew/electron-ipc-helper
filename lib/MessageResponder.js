import { ipcMain } from 'electron'

export default class MessageResponder {
  constructor (requestEvent) {
    this.requestEvent = requestEvent
  }

  respond (handler) {
    ipcMain.on(this.requestEvent, (event, request) => {
      this.responseEvent = request.responseEvent
      this.event = event
      handler(request.arg).then(response => {
        this.send(response)
      }).catch(err => {
        this.send(this.error(err))
      })
    })
  }

  send (response) {
    this.event.reply(this.responseEvent, response)
  }

  error (err) {
    return {
      ok: false,
      error: err
    }
  }
}
