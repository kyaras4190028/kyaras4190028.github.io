/* =========================================
   GET HTML ELEMENTS
========================================= */

const song = document.querySelector("#song");

const playPauseButton = document.querySelector("#play-pause-button");
const playPauseIcon = document.querySelector("#play-pause-icon");

const replayButton = document.querySelector("#replay-button");
const startButton = document.querySelector("#start-button");
const endButton = document.querySelector("#end-button");
const shuffleButton = document.querySelector("#shuffle-button");

const volumeButton = document.querySelector("#volume-button");
const volumeIcon = document.querySelector("#volume-icon");
const volumeStatus = document.querySelector("#volume-status");

const currentTimeDisplay = document.querySelector("#current-time");
const durationDisplay = document.querySelector("#duration");

const progressContainer = document.querySelector("#progress-container");
const progressFill = document.querySelector("#progress-fill");

const musicNotes = document.querySelector("#music-notes");


/* =========================================
   FORMAT TIME
========================================= */

function formatTime(time) {
  if (!Number.isFinite(time)) {
    return "00:00";
  }

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return String(minutes).padStart(2, "0") + ":" +
         String(seconds).padStart(2, "0");
}


/* =========================================
   PLAY / PAUSE TOGGLE
========================================= */

function updatePlayPauseButton() {
  if (song.paused) {
    playPauseIcon.src = "./Document_files/play.png";
    playPauseButton.setAttribute("aria-label", "Play");
    musicNotes.classList.remove("playing");
  } else {
    playPauseIcon.src = "./Document_files/pause.png";
    playPauseButton.setAttribute("aria-label", "Pause");
    musicNotes.classList.add("playing");
  }
}

playPauseButton.addEventListener("click", function () {
  if (song.paused) {
    song.play().catch(function (error) {
      console.log("The audio could not be played:", error);
    });
  } else {
    song.pause();
  }
});


/* =========================================
   REPLAY
========================================= */

replayButton.addEventListener("click", function () {
  song.currentTime = 0;

  song.play().catch(function (error) {
    console.log("The audio could not be played:", error);
  });
});


/* =========================================
   SKIP TO START
========================================= */

startButton.addEventListener("click", function () {
  song.currentTime = 0;
});


/* =========================================
   SKIP TO END
========================================= */

endButton.addEventListener("click", function () {
  if (Number.isFinite(song.duration)) {
    song.currentTime = song.duration;
  }
});


/* =========================================
   SHUFFLE TOGGLE
========================================= */

let shuffleEnabled = false;

shuffleButton.addEventListener("click", function () {
  shuffleEnabled = !shuffleEnabled;

  shuffleButton.classList.toggle("active", shuffleEnabled);

  shuffleButton.setAttribute(
    "aria-label",
    shuffleEnabled ? "Shuffle on" : "Shuffle off"
  );

  shuffleButton.setAttribute("aria-pressed", String(shuffleEnabled));
});


/* =========================================
   MUTE / UNMUTE TOGGLE
========================================= */

volumeButton.addEventListener("click", function () {
  song.muted = !song.muted;

  if (song.muted) {
    volumeIcon.src = "./Document_files/noaudio.png";
    volumeButton.setAttribute("aria-label", "Turn sound on");
    volumeButton.setAttribute("aria-pressed", "true");
    volumeStatus.textContent = "Sound off";
  } else {
    volumeIcon.src = "./Document_files/audio.png";
    volumeButton.setAttribute("aria-label", "Mute audio");
    volumeButton.setAttribute("aria-pressed", "false");
    volumeStatus.textContent = "Sound on";
  }
});


/* =========================================
   UPDATE TIMER AND PROGRESS BAR
========================================= */

function updateProgress() {
  currentTimeDisplay.textContent = formatTime(song.currentTime);

  if (Number.isFinite(song.duration)) {
    durationDisplay.textContent = formatTime(song.duration);

    const progress = (song.currentTime / song.duration) * 100;

    progressFill.style.width = progress + "%";

    progressContainer.setAttribute(
      "aria-valuenow",
      String(Math.round(progress))
    );
  }
}

song.addEventListener("timeupdate", updateProgress);

song.addEventListener("loadedmetadata", function () {
  durationDisplay.textContent = formatTime(song.duration);
});

song.addEventListener("play", updatePlayPauseButton);
song.addEventListener("pause", updatePlayPauseButton);

song.addEventListener("ended", function () {
  updatePlayPauseButton();
  progressFill.style.width = "0%";
});


/* =========================================
   CLICKABLE PROGRESS BAR
========================================= */

progressContainer.addEventListener("click", function (event) {
  if (!Number.isFinite(song.duration)) {
    return;
  }

  const barWidth = progressContainer.clientWidth;
  const clickPosition = event.offsetX;
  const percentage = clickPosition / barWidth;

  song.currentTime = percentage * song.duration;
});


/* =========================================
   KEYBOARD ACCESS FOR PROGRESS BAR
========================================= */

progressContainer.addEventListener("keydown", function (event) {
  if (!Number.isFinite(song.duration)) {
    return;
  }

  if (event.key === "ArrowRight") {
    song.currentTime = Math.min(song.currentTime + 5, song.duration);
  }

  if (event.key === "ArrowLeft") {
    song.currentTime = Math.max(song.currentTime - 5, 0);
  }
});


/* =========================================
   INITIAL PLAYER STATE
========================================= */

updatePlayPauseButton();
updateProgress();