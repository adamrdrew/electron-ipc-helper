
class MessageResponder {
  constructor (requestEvent) {
    this.requestEvent = requestEvent
  }

  respond (callback) {
    return new Promise((resolve, reject) => {
      ipcMain.on(this.requestEvent, (event, response) => {
        this.responseEvent = response.responseEvent
        this.event = event
        this.send(callback(response.arg))
      })
    })
  }

  send (response) {
    this.event.reply(this.responseEvent, response)
  }
}

class MessageSender {
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

export { MessageResponder, MessageSender }