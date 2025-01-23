const express = require('express')
const socket = require('socket.io')

const app = express()
PORT = 8080
const server = app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})


const wsServer = socket(server)



const clientList = []
let content = ""
wsServer.on('connection', (socket) => {
    // console.log(`Client connected: ${socket.id}`)
    clientList.push(socket.id);        
    
    // No. of connected clients
    const connectedClients = wsServer.sockets.adapter.rooms.size;
    console.log('Connected clients:', connectedClients);
    console.log(clientList)

    // socket.on('message', (data)=>{
    //     console.log(`message from ${socket.id}:`, JSON.stringify(data.data.text))
    // })

    // sending initial data to the client

    // There will be two type of data i.e. init => initializtion for a new connection 
    // & update => for updating the data to document coming from client 
    socket.emit('msg', JSON.stringify({type: 'init', data: content}))


    socket.on('message', (message) => {
        try{
            const parsedMessage = JSON.parse(message);
            if(parsedMessage.type === 'update'){
                content = parsedMessage.data;
                clientList.forEach((client) => {
                    socket.to(client).emit('data', JSON.stringify({type: 'update', data: content}))
                })
                console.log('Message: ', content)

            }
        }
        catch(error){
            console.error('Error parsing the data: ',error)
        }

    })

    socket.on('disconnect', ()=>{
        console.log(`Client Disconnected: ${socket.id}`)
        const index = clientList.indexOf(socket.id)
        if (index > -1) {
            clientList.splice(index, 1)
        }

        console.log(clientList)
    })

})



