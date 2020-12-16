const socket = io();

var typing=false;
var timeout=undefined;


// PEER JS

const videoGrid = document.getElementById('video-grid');
const peer = new Peer;

let videoStream;

const video = document.createElement('video');

video.muted = true;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
})
.then(stream => {
    videoStream = stream;
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

peer.on('open', id => {
  socket.emit('join', ROOM_ID, id)
})

socket.on('join', id => {
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
  };

  function muteAudio (video) {
    let notMuted = video.getAudioTracks()[0].enabled;

    if (notMuted) {
      video.getAudioTracks()[0].enabled = false;
    } else {
      video.getAudioTracks()[0].enabled = true;
    }
  };

  