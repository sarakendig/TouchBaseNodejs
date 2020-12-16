const express = require('express');
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
// const cors = require('cors')

const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});


const PORT = process.env.PORT || 5000;

const roomId = socket.id;

app.use('/peerjs', peerServer);
// app.use(cors())

app.set('view engine', 'ejs')
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.redirect(`/${roomId}`);
});

app.get('/:room', (req,res) => {
    res.render('room', {roomId: req.params.room})
})



io.on('connection', socket => {
    // console.log(socket)
    const { id } = socket.client;
    console.log(`User connected: ${id}`);
 

    socket.on('join', (roomId, username) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('New user joined', username)
    })

   

    socket.on('chat', (msg) => {
        console.log('message sent: ' + msg)
        io.to(roomId).emit('chat', id + ':' + msg)
    })

    socket.on('typing', () => {
        console.log('typing...')
        io.to(roomId).emit('typing', userId ) 
    })

    socket.on('diconnect', () => {
        console.log('User logged out')
        socket.to(roomId).emit('user logged off', userId)
    })
})



server.listen(PORT, () => console.log(`Listening on port ${PORT}`));



