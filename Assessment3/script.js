
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const darkOverlay = document.getElementById("dark-overlay");
const magnifyingGlass = document.getElementById("magnifying-glass");
const pipTarget = document.getElementById("pip-target");
const winScreen = document.getElementById("win-screen");
const playAgain = document.getElementById("play-again");
const game = document.querySelector(".game");

let gameStarted = false;
let pipFound = false;

// Remember the last cursor position
let lastMouseX = window.innerWidth / 2;
let lastMouseY = window.innerHeight / 2;

// Start the game
function startGame() {
    if (gameStarted) return;

    gameStarted = true;
    pipFound = false;

    startScreen.style.display = "none";
    darkOverlay.classList.add("active");
    magnifyingGlass.style.display = "block";

    moveMagnifyingGlass(lastMouseX, lastMouseY);
}

// Move the magnifying glass and reveal circle
function moveMagnifyingGlass(clientX, clientY) {
    const gameRect = game.getBoundingClientRect();

    const x = clientX - gameRect.left;
    const y = clientY - gameRect.top;

    // Centre the PNG on the cursor
    magnifyingGlass.style.left =
        (x - magnifyingGlass.offsetWidth / 2) + "px";

    magnifyingGlass.style.top =
        (y - magnifyingGlass.offsetHeight / 2) + "px";

    // Offset the reveal slightly to align with the lens
    darkOverlay.style.setProperty("--mouse-x", (x - 26) + "px");
    darkOverlay.style.setProperty("--mouse-y", (y - 23) + "px");
    // Change 20 to make the clear circle smaller or bigger
    darkOverlay.style.setProperty("--reveal-radius", "48px");


    // Check whether Pip has been found
    checkForPip(clientX, clientY);
}

// Check if the cursor reaches Pip
function checkForPip(clientX, clientY) {
    if (!gameStarted || pipFound) return;

    const targetRect = pipTarget.getBoundingClientRect();

    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;

    const distance = Math.hypot(
        clientX - targetX,
        clientY - targetY
    );

    // Trigger the popup when the cursor reaches Pip
    if (distance < 70) {
        pipFound = true;
        winScreen.style.display = "flex";
    }
}

// Follow mouse movement
document.addEventListener("mousemove", function(event) {
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

    if (gameStarted) {
        moveMagnifyingGlass(event.clientX, event.clientY);
    }
});

// Click title to start
startButton.addEventListener("click", startGame);

// Allow keyboard activation
startButton.addEventListener("keydown", function(event) {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        startGame();
    }
});


// Restart the game
playAgain.addEventListener("click", function() {
    pipFound = false;
    gameStarted = false;

    winScreen.style.display = "none";
    startScreen.style.display = "flex";
    darkOverlay.classList.remove("active");
    magnifyingGlass.style.display = "none";
});
