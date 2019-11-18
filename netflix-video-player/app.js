const init = () => {
  bindUiActions();
  uiElements.watchedBar.style.width = '0px';
  uiElements.pauseButton.classList.add('hide');
  uiElements.minimizeButton.classList.add('hide');
  uiElements.mutedButton.classList.add('hide');
};

const getElement = path => {
  return document.querySelector(path);
};

const uiElements = {
  document: document,
  body: document.body,
  videoContainer: getElement('.video-container'),
  video: getElement('.video-container video'),
  controlsContainer: getElement('.video-container .controls-container'),
  fastForwardButton: getElement('.video-container .controls button.fast-forward'),
  fullScreenButton: getElement('.video-container .controls button.full-screen'),
  playPauseButton: getElement('.video-container .controls button.play-pause'),
  rewindButton: getElement('.video-container .controls button.rewind'),
  volumeButton: getElement('.video-container .controls button.volume'),
  fullVolumeButton: getElement('.video-container .controls button.volume .full-volume'),
  maximizeButton: getElement('.video-container .controls button.full-screen .maximize'),
  minimizeButton: getElement('.video-container .controls button.full-screen .minimize'),
  playButton: getElement('.video-container .controls button.play-pause .playing'),
  pauseButton: getElement('.video-container .controls button.play-pause .paused'),
  mutedButton: getElement('.video-container .controls button.volume .muted'),
  watchedBar: getElement('.video-container .progress-controls .progress-bar .watched-bar'),
  progressBar: getElement('.video-container .progress-controls .progress-bar'),
  timeLeft: getElement('.video-container .progress-controls .time-remaining')
};

const bindUiActions = () => {
  uiElements.document.addEventListener('mousemove', displayControls);
  uiElements.document.addEventListener('keyup', handleKeyUp);
  uiElements.video.addEventListener('timeupdate', handleTimeUpdate);
  uiElements.progressBar.addEventListener('click', handleProgessBarClicked);
  uiElements.playPauseButton.addEventListener('click', handlePlayPause);
  uiElements.rewindButton.addEventListener('click', handleRewind);
  uiElements.fastForwardButton.addEventListener('click', handleForward);
  uiElements.volumeButton.addEventListener('click', toggleMute);
  uiElements.fullScreenButton.addEventListener('click', toggleFullScreen);
};

const displayControls = () => {
  const { controlsContainer, body } = uiElements;

  let controlsTimeout;
  controlsContainer.style.opacity = '1';
  body.style.cursor = 'initial';

  controlsTimeout && clearTimeout(controlsTimeout);

  controlsTimeout = setTimeout(() => {
    controlsContainer.style.opacity = '0';
    body.style.cursor = 'none';
  }, 5000);
};

const handlePlayPause = () => {
  uiElements.video.paused ? play() : pause();
};

const play = () => {
  uiElements.video.play();
  showHide(uiElements.pauseButton, uiElements.playButton);
};

const pause = () => {
  uiElements.video.pause();
  showHide(uiElements.playButton, uiElements.pauseButton);
};

const showHide = (show, hide) => {
  show.classList.add('show');
  show.classList.remove('hide');
  hide.classList.add('hide');
  hide.classList.remove('show');
};

const toggleMute = () => {
  const { video, mutedButton, fullVolumeButton } = uiElements;
  video.muted ? showHide(fullVolumeButton, mutedButton) : showHide(mutedButton, fullVolumeButton);
  video.muted = !video.muted;
};

const toggleFullScreen = () => {
  document.fullscreenElement ? exitFullScreen() : requesFullScreen();
};

const exitFullScreen = () => {
  document.exitFullscreen();
  showHide(uiElements.maximizeButton, uiElements.minimizeButton);
};

const requesFullScreen = () => {
  uiElements.videoContainer.requestFullscreen();
  showHide(uiElements.minimizeButton, uiElements.maximizeButton);
};

const handleKeyUp = event => {
  switch (event.code) {
    case 'Space':
      handlePlayPause();
      break;
    case 'KeyM':
      toggleMute();
      break;
    case 'KeyF':
      toggleFullScreen();
      break;
    case 'ArrowRight':
      handleForward();
      break;
    case 'ArrowLeft':
      handleRewind();
      break;
  }

  displayControls();
};

const handleTimeUpdate = () => {
  const { video, watchedBar, timeLeft } = uiElements;

  watchedBar.style.width = (video.currentTime / video.duration) * 100 + '%';
  // TODO: calculate hours as well...
  const totalSecondsRemaining = video.duration - video.currentTime;
  // THANK YOU: BEGANOVICH
  const time = new Date(null);

  time.setSeconds(totalSecondsRemaining);

  let hours = null;

  if (totalSecondsRemaining >= 3600) {
    hours = time
      .getHours()
      .toString()
      .padStart('2', '0');
  }

  let minutes = time
    .getMinutes()
    .toString()
    .padStart('2', '0');

  let seconds = time
    .getSeconds()
    .toString()
    .padStart('2', '0');

  timeLeft.textContent = `${hours ? hours + ':' : ''}${minutes}:${seconds}`;
};

const handleProgessBarClicked = () => {
  uiElements.video.currentTime = getMousePositionOnProgressbar() * uiElements.video.duration;
};

const handleRewind = () => {
  uiElements.video.currentTime -= 10;
};
const handleForward = () => {
  uiElements.video.currentTime += 10;
};

const getMousePositionOnProgressbar = () => {
  const progressBar = uiElements.progressBar;
  return (event.pageX - (progressBar.offsetLeft + progressBar.offsetParent.offsetLeft)) / progressBar.offsetWidth;
};

init();
