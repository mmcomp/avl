#!/usr/bin/env node
'use strict';

// load the Node.js TCP library
const net = require('net')

const PORT = 33003
const ADDRESS = '0.0.0.0'

let server = net.createServer(onClientConnected)
server.listen(PORT, ADDRESS)

function onClientConnected(socket) {
  console.log(`New client: ${socket.remoteAddress}:${socket.remotePort}`)
  socket.on('data',function(data){
    console.log('data')
    console.log(""+data+"")
//     socket.destroy()
  })
  socket.on('error',function(err){
    console.log('error',err)
    socket.destroy()
  })
//   socket.destroy()
}

console.log(`Server started at: ${ADDRESS}:${PORT}`)