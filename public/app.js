const socket = io('/');

var typing=false;
var timeout=undefined;



// PEER JS

// use port 443 for heroku

const peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "5000",
}); 

const videoGrid = document.getElementById('video-grid');


const peers = {};
let localVideoStream;

const video = document.createElement('video');

video.muted = true;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
})
.then(stream => {
    localVideoStream = stream;
    addUserVideo(video, stream)
})
peer.on('call', call =>{
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideo => {
        addUserStream(video, userVideo)
})
});




//   SOCKET IO



socket.on('joined', id => {
  connect(id, stream)
})

  $('form').submit(e => {
      e.preventDefault();
      socket.emit('chat', $('#message-input').val());
      $('#message-input').val('');
      return false;
  });

  socket.on('chat', msg => {
      $('#message-box').append($('<li>').text(msg))
  })


  socket.on('typing', (data) => {
    if(data.typing==true){
      $('.tying')
    }
  })

  socket.on('logout', msg => {
      $('#message-box').append($('<li>').text('User has logged off'));
  })

  peer.on('open', id => {
    console.log('My peer ID is: ' + id);
    socket.emit('join', roomId, id);
    console.log('peer connected')
    
  })


  // functions

  function addUserVideo(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videoGrid.append(video)
  };



  function connect(id, stream) {
    const call = peer.call(id, stream)
    const video = document.createElement('video')
    call.on('stream', userVideo => {
      addUserVideo(video, userVideo)
    }),
     (err) => {
      console.error('Failed to get local stream', err);
     },
     call.on('close', () => {
       video.remove()
     })
     peers[id] = call
  };

  function muteAudio () {
    let notMuted = localVideoStream.getAudioTracks()[0].enabled;

    if (notMuted) {
      localVideoStream.getAudioTracks()[0].enabled = false;
    } else {
      localVideoStream.getAudioTracks()[0].enabled = true;
    }
  };

  function stopVideo () {
    let notStopped = localVideoStream.getVideoTracks()[0].enabled;

    if (notStopped) {
      localVideoStream.getVideoTracks()[0].enabled = false;
    } else {
      localVideoStream.getVideoTracks()[0].enabled = true;
    }
  }

 
  







 