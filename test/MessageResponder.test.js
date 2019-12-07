import MessageResponder from '../lib/MessageResponder'

test('Instantiates and sets requestEvent', () => {
  const msg = 'testMessage'
  const responder = new MessageResponder(msg)
  expect(responder.requestEvent).toStrictEqual(msg)
})

test('Creates an error response', () => {
  const msg = 'testMessage'
  const responder = new MessageResponder(msg)
  const error = responder.error(msg)
  expect(error.ok).toStrictEqual(false)
  expect(error.error).toStrictEqual(msg)
})

/*
I can't think of a valid test for MessageResponder#respond.
It doesn't return or mutate anything. It wraps around
ipcMain#on. I tried mocking ipcMain#on and making it raise
an exception that we could catch but that made Jest very
mad. After like 20 failed runs with that approach I decided
it was a lost cause. Contributions welcome.
*/
