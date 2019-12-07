import MessageSender from '../lib/MessageSender'

test('Instantiates and sets requestEvent', () => {
  const msg = 'testMessage'
  const sender = new MessageSender(msg)
  expect(sender.requestEvent).toBe(msg)
})

test('Generates unique response events', () => {
  const msg = 'testMessage'
  const sender = new MessageSender(msg)
  const firstEvent = sender.newResponseEvent()
  const secondEvent = sender.newResponseEvent()
  expect(firstEvent).not.toBe(secondEvent)
})

test('Response names based on request names', () => {
  const msg = 'testMessage'
  const sender = new MessageSender(msg)
  const event = sender.newResponseEvent()
  expect(event).toContain(`${msg}-response-`)
})

test('#send returns a Promise', () => {
  const msg = 'testMessage'
  const sender = new MessageSender(msg)
  const promise = sender.send()
  expect(promise).toBeInstanceOf(Promise)
})

test('#send gets a promise with a value in resolve from ipcRenderer', () => {
  const msg = 'testMessage'
  const sender = new MessageSender(msg)
  const promise = sender.send()
  promise.then((arg) => {
    expect(arg).toBe('ipcRenderOnceWorked')
  })
})

test('#send can provide ipcRenderer an argument that gets included in the promise', () => {
  const msg = 'testMessage'
  const sender = new MessageSender(msg)
  const promise = sender.send('argTest')
  promise.then((arg) => {
    expect(arg).toBe('argTestWorked')
  })
})

test('#send gets a promise that is rejected if there is an error thrown in ipcRenderer', () => {
  const msg = 'pleaseRaiseException'
  const sender = new MessageSender(msg)
  const promise = sender.send()
  promise.catch((err) => {
    expect(err).toBe(new Error('This is a test'))
  })
})