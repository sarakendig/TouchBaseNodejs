const express = require('express');
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require('uuid');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});

// PORT

const PORT = process.env.PORT || 5000;


// PEER JS

app.use('/peerjs', peerServer);

// MIDDLEWARE

app.set('view engine', 'ejs')
app.use(express.static('public'))


// ROUTES


app.get('/', (req, res) => {
    res.redirect(`/${roomId}`);
    
});

app.get('/:room', (req,res) => {
    res.render('room', {rooms: req.params.room})
})

const roomId = uuidV4();


// SOCKET

io.on('connection', socket => {
    console.log('room id:' + roomId)
    // console.log(socket)
    const { id } = socket.client;
    console.log(`User connected: ${id}`);

    //   socket.join(roomId);

      socket.on('join', (roomId, id) => {
        socket.join(roomId)
      
        socket.to(roomId).broadcast.emit('joined', id);
      
      

        socket.on('chat', msg => {
            console.log('message sent: ' + msg)
            io.to(roomId).emit('chat', id + ':' + msg );
        })
    
        socket.on('typing', (data) => {
            console.log('typing...')
            if(data.typing==true) {
                io.emit('typing', id + data ) 
            }
           
    
        })

    })

    socket.on('logout', () => {
        console.log('User logged out')
        socket.emit('user ${id} logged off')
    })
})



server.listen(PORT, () => console.log(`Listening on port ${PORT}`));






// setup peerjs server with express : https://stackoverflow.com/questions/26712426/setup-peerjs-server-combined-with-express


// uuid: https://www.npmjs.com/package/uuid


// peerjs https://github.com/peers/peerjs

// https://riptutorial.com/webrtc/example/29031/get-access-to-your-audio-and-video-using-getusermedia---api--hello-webrtc-