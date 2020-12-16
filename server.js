const express = require('express');
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
// const cors = require('cors')
const { v4: uuidV4 } = require('uuid')
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});


const PORT = process.env.PORT || 5000;


app.use('/peerjs', peerServer);
// app.use(cors())

app.set('view engine', 'ejs')
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`);
});

app.get('/:room', (req,res) => {
    res.render('room', {roomId: req.params.room})
})



io.on('connection', socket => {
    // console.log(socket)
    const { id } = socket.client;
    console.log(`User connected: ${id}`);
 

    socket.on('join', (roomId, id) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('New user joined', id)
        console.log(id, 'joined')
    })

   

    socket.on('chat', msg => {
        console.log('message sent: ' + msg)
        io.emit('chat', id + ':' + msg )
    })

    socket.on('typing', (data) => {
        console.log('typing...')
        if(data.typing==true) {
            io.emit('typing', id + data ) 
        }
       

    })

    socket.on('diconnect', () => {
        console.log('User logged out')
        socket.emit('user logged off', id)
    })
})



server.listen(PORT, () => console.log(`Listening on port ${PORT}`));






// setup peerjs server with express : https://stackoverflow.com/questions/26712426/setup-peerjs-server-combined-with-express


// uuid: https://www.npmjs.com/package/uuid


// peerjs https://github.com/peers/peerjs