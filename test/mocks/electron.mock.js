
const ipcRenderer = {
  once (event, arg) {
    if ( arg === 'argTest' ) {
      return 'argTestWorked'
    }
    if (event.indexOf('pleaseRaiseException') !== -1) {
      throw new Error('This is a test')
    }
    return 'ipcRenderOnceWorked'
  },
  send: jest.fn()
}

const ipcMain = {
  on: jest.fn()
}

export { ipcRenderer, ipcMain }
