// =========================================
// GET THE HTML ELEMENTS
// =========================================

const audio = document.querySelector("#album-audio");

const playPauseButton = document.querySelector("#play-pause-button");
const playPauseIcon = document.querySelector("#play-pause-icon");

const replayButton = document.querySelector("#replay-button");
const previousButton = document.querySelector("#previous-button");
const nextButton = document.querySelector("#next-button");
const shuffleButton = document.querySelector("#shuffle-button");

const volumeButton = document.querySelector("#volume-button");
const volumeIcon = document.querySelector("#volume-icon");
const volumeLabel = document.querySelector("#volume-label");

const timer = document.querySelector("#timer");
const progressBar = document.querySelector("#progress-bar");

const musicNotes = document.querySelector("#music-notes");


// =========================================
// PLAY / PAUSE BUTTON
// The same button switches between playing
// and pausing the music.
// =========================================

playPauseButton.addEventListener("click", function () {

  if (audio.paused) {
    audio.play();

    playPauseIcon.src = "./Document_files/pause.png";
    playPauseButton.setAttribute("aria-label", "Pause music");

  } else {
    audio.pause();

    playPauseIcon.src = "./Document_files/play.png";
    playPauseButton.setAttribute("aria-label", "Play music");
  }

});


// =========================================
// UPDATE BUTTON WHEN AUDIO ENDS
// =========================================

audio.addEventListener("ended", function () {

  playPauseIcon.src = "./Document_files/play.png";
  playPauseButton.setAttribute("aria-label", "Play music");

});


// =========================================
// RESTART TRACK
// =========================================

function restartTrack() {
  audio.currentTime = 0;
}

replayButton.addEventListener("click", restartTrack);
previousButton.addEventListener("click", restartTrack);


// =========================================
// NEXT BUTTON
// With one song loaded, this skips to the end.
// =========================================

nextButton.addEventListener("click", function () {
  audio.currentTime = audio.duration || 0;
});


// =========================================
// SHUFFLE BUTTON
// With one song loaded, shuffle jumps to
// a random point in the current track.
// =========================================

shuffleButton.addEventListener("click", function () {

  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = Math.random() * audio.duration;
  }

});


// =========================================
// MUTE / UNMUTE BUTTON
// The same button switches audio on and off.
// =========================================

volumeButton.addEventListener("click", function () {

  audio.muted = !audio.muted;

  if (audio.muted) {
    volumeIcon.src = "./Document_files/noaudio.png";
    volumeButton.setAttribute("aria-label", "Unmute audio");
    volumeLabel.textContent = "Sound off";

  } else {
    volumeIcon.src = "./Document_files/audio.png";
    volumeButton.setAttribute("aria-label", "Mute audio");
    volumeLabel.textContent = "Sound on";
  }

});


// =========================================
// UPDATE TIMER AND PROGRESS BAR
// =========================================

function formatTime(seconds) {

  if (!Number.isFinite(seconds)) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(remainingSeconds).padStart(2, "0")
  );

}


audio.addEventListener("timeupdate", function () {

  timer.textContent = formatTime(audio.currentTime);

  if (Number.isFinite(audio.duration) && audio.duration > 0) {

    const progress = (audio.currentTime / audio.duration) * 100;

    progressBar.style.width = progress + "%";

  }

});


// =========================================
// SHOW TOTAL TRACK LENGTH WHEN LOADED
// =========================================

audio.addEventListener("loadedmetadata", function () {

  timer.textContent = formatTime(audio.currentTime);

});


// =========================================
// ANIMATED MUSIC NOTES
// Notes appear while the song is playing.
// =========================================

let noteInterval = null;

const noteCharacters = ["♪", "♫", "♬", "♩"];


function createMusicNote() {

  const note = document.createElement("span");

  note.classList.add("music-note");

  note.textContent =
    noteCharacters[Math.floor(Math.random() * noteCharacters.length)];

  // Give each note a random position and size.
  note.style.setProperty("--note-left", Math.random() * 85 + "%");
  note.style.setProperty("--note-size", 20 + Math.random() * 22 + "px");

  musicNotes.appendChild(note);

  // Remove the note after its animation finishes.
  note.addEventListener("animationend", function () {
    note.remove();
  });

}


// Start making notes when the music plays.
audio.addEventListener("play", function () {

  if (noteInterval === null) {

    createMusicNote();

    noteInterval = setInterval(createMusicNote, 500);

  }

});


// Stop making new notes when the music pauses.
audio.addEventListener("pause", function () {

  clearInterval(noteInterval);
  noteInterval = null;

});


// Clear notes and stop the animation when the song ends.
audio.addEventListener("ended", function () {

  clearInterval(noteInterval);
  noteInterval = null;

  musicNotes.innerHTML = "";

});