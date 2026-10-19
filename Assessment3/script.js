
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

// Remember the latest mouse position
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

    // Centre the glass PNG around the cursor
    magnifyingGlass.style.left =
        (x - magnifyingGlass.offsetWidth / 2) + "px";

    magnifyingGlass.style.top =
        (y - magnifyingGlass.offsetHeight / 2) + "px";

    // Position the clear circle to match your lens
    const lensX = x - 26;
    const lensY = y - 23;

    darkOverlay.style.setProperty("--mouse-x", lensX + "px");
    darkOverlay.style.setProperty("--mouse-y", lensY + "px");
    darkOverlay.style.setProperty("--reveal-radius", "48px");

    // Check the centre of the lens against Pip
    checkForPip(
        clientX - 26,
        clientY - 23
    );
}

// Check whether the lens reaches Pip
function checkForPip(lensClientX, lensClientY) {
    if (!gameStarted || pipFound) return;

    const targetRect = pipTarget.getBoundingClientRect();

    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;

    const distance = Math.hypot(
        lensClientX - targetX,
        lensClientY - targetY
    );

    // Show the congratulations popup when the lens reaches Pip
    if (distance < 30) {
        pipFound = true;
        winScreen.style.display = "flex";
    }
}

// Follow the mouse
document.addEventListener("mousemove", function(event) {
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

    if (gameStarted) {
        moveMagnifyingGlass(event.clientX, event.clientY);
    }
});

// Click the title to start
startButton.addEventListener("click", startGame);

// Keyboard support for the title
startButton.addEventListener("keydown", function(event) {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        startGame();
    }
});

// Restart the game from the congratulations popup
playAgain.addEventListener("click", function() {
    pipFound = false;
    gameStarted = false;

    winScreen.style.display = "none";
    startScreen.style.display = "flex";
    darkOverlay.classList.remove("active");
    magnifyingGlass.style.display = "none";
});
