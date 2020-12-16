// PEER JS

const videoGrid = document.getElementById('video-grid');
const peer = new Peer;

let videoStream;

const video = document.createElement('video');
const peers = {};

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
})
.then(stream => {
    videoStream = stream;
    video.srcObject = stream;
    video.onloadedmetadata = (e) => {
        video.play();
    };
    videoGrid.append(video)
})
peer.on('call', call =>{
    call.answer(stream)
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
})
.catch(error => {
    alert('Please enable camera permissions')

});

function addUserVideo(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videoGrid.append(video)
  };




//   SOCKET IO

  $(function () {
           

});