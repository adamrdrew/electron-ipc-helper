import MessageResponder from '../lib/MessageResponder'

test('Instantiates and sets requestEvent', () => {
  const msg = 'testMessage'
  const responder = new MessageResponder(msg)
  expect(responder.requestEvent).toBe(msg)
})