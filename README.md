# Electron IPC Helper
A couple of a classes that make Electron IPC a little easier. 

When using IPC in Electron you often want to perform call and response operations where you send a request and get a response, not unlike using `fetch` with a REST API in a web app. The IPC API in Electron doesn't really follow that model and instead treats sending messages back and forth as seperate isolated events. To perform a simple query for example requires that the render process send the request event and then register a handler with a callback for the response event while the main process registers a handler with a callback for request event and then sends the response event. This means doing double the work for each event type. It also means that your render process code is filled with callbacks that can make it hard to reason about. Electron IPC Helper provides a couple of simple classes that handle all of this for you while exposing a simple API that feels more like a single asynchronous promise based query, like a `fetch`, than the standard Electron API does.

* Allows you to register a single event for an IPC conversation instead of having to handle sending and recieving with seperate events
* Provides a response to the sender asynchronously via a Promise rather than through a callback and a second event
* Handles the work of registering a unique single-use response event and event handler for every IPC request to ensure that your requests get handled in the order you expect them to

## Installation
Install the module:
```
npm install --save electron-ipc-helper
```

## A Basic Example
In this example our render code wants a list of people from the main process. You can imagine any operation where our render process wants information from the main process that requires an asynchronous request, such as asking the main process for something from a database or the filesystem.

We start in the render process by creating a MessageSender instance. The string we provide MessageSender's constructor is the message the two processes will use; this string can be anything you want, so long as both processes agree on the message name. We can imagine that this code might appear in a click event handler for a button, or in an action in a VueX store or something like that.
#### Render Process:
```javascript
import MessageSender from 'electron-ipc-helper'
const getPeople = new MessageSender('getPeople')
getPeople.send().then((people) => {
  this.people = people
})
```
In our main process we set up the MessageResponder that will respond to the message that we are sending from the render process. The `MessageResponder#respond` method is provided an anonymous function that will be invoked as the event handler when the message comes in.
#### Main Process:
```javascript
import MessageResponder from 'electron-ipc-helper'
const getPeople = new MessageResponder('getPeople')
getPeople.respond(() => {
  return people
})
```
## An Example With Arguments
You can include an argument along with your message. Simply provide the argument to `MessageSender#send`. When `MessageResponder#respond` invokes your event handler anonymous function it will be passed the argument that came with the event.
#### Render Process:
```javascript
const getPerson = new MessageSender('getPerson')
getPerson.send(this.selectedPersonName).then((person) => {
  this.selectedPersonInfo = person
})
```
#### Main Process:
```javascript
const getPerson = new MessageResponder('getPerson')
getPerson.respond((personName) => {
  return people.find(person => person.name === personName)
})
```