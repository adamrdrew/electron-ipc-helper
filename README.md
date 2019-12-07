# Electron IPC Helper

[![Build Status](https://travis-ci.org/adamrdrew/electron-ipc-helper.svg?branch=master)](https://travis-ci.org/adamrdrew/electron-ipc-helper)

 When using IPC in Electron you often want to perform call and response operations where you send a request and get a response, not unlike using `fetch` with a REST API in a web app. The IPC API in Electron doesn't really follow that model and instead treats sending messages back and forth as seperate isolated events. To perform a simple query requires that the render process send the request event and then register a handler with a callback for the response event while the main process registers a handler with a callback for request event and then sends the response event. This means doing double the work for each event type. It also means that your render process code is filled with callbacks that can make it hard to reason about. Electron IPC Helper provides a couple of simple classes that handle all of this for you while exposing a simple API that feels more like a single asynchronous promise based query, like a `fetch`, than the standard Electron API does.

* Allows you to register a single event for an IPC conversation instead of having to handle sending and recieving with seperate events
* Provides a response to the sender asynchronously via a Promise rather than through a callback and a second event
* Handles the work of registering a unique single-use response event and handler for every IPC response to ensure that your requests get handled in the order you expect them to

## Installation
Install the module:
```
npm install --save electron-ipc-helper
```

## A Basic Example
In this example our render code wants a list of people from the main process. You can imagine any operation where our render process wants information from the main process that requires an asynchronous request, such as asking the main process for something from a database or the filesystem.

We start in the render process by creating a `MessageSender` instance. The string we provide the `MessageSender` constructor is the message the two processes will use; this string can be anything you want, so long as both processes agree on the message name. We can imagine that this code might appear in a click event handler for a button, or in an action in a VueX store or something like that.
#### Render Process:
```javascript
import MessageSender from 'electron-ipc-helper'

const getPeople = new MessageSender('getPeople')

getPeople.send().then((people) => {
  this.people = people
})
```
In our main process we set up the `MessageResponder` that will respond to the message that we are sending from the render process. The `MessageResponder#respond` method is provided a function that will serve as the event handler and will be called every time the event is handled. The event handler function must return a Promise.
#### Main Process:
```javascript
import MessageResponder from 'electron-ipc-helper'

const people = ["Dave", "Joan", "Mustafa", "Xi"]

const getPeople = new MessageResponder('getPeople')

getPeople.respond(() => {
  return new Promise((resolve, reject) => {
    resolve(people)
  })
})
```
## An Example With Arguments
You can include an argument along with your message. Simply provide the argument to `MessageSender#send`. `MessageResponder` will recieve the argument and pass it to the handler function you defined.
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
  return new Promise((resolve, reject) => {
    const person = people.find(p => p.name === personName)
    resolve(person)
  })
})
```

## With a Promise Based Library
In a real application you are very likely going to use `MessageReponder` with a Promise based library rather than crafting your own promises. You can of course craft your own, but more likely you are using a file transfer or database library that already returns Promises. Here's an example with Sequelize models:

#### Main Process
```javascript
const getArtists = new MessageResponder('getArtists')
getArtists.respond(() => {
  return Artist.findAll()
})

const getArtist = new MessageResponder('getArtist')
getArtist.respond((artistName) => {
  return Artist.findAll({where: {name: artistName}})
})
```