
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

// Initial cursor position
let lastMouseX = window.innerWidth - 75;
let lastMouseY = 75;

/*
    These values estimate the centre of the lens
    within the magnifying glass PNG.
*/
const LENS_X = 0.376;
const LENS_Y = 0.349;

// Start the game
function startGame() {
    if (gameStarted) return;

    gameStarted = true;
    pipFound = false;

    startScreen.style.display = "none";
    darkOverlay.classList.add("active");
    magnifyingGlass.style.display = "block";

    // Start near the top-right corner
    const rect = game.getBoundingClientRect();

    lastMouseX = rect.right - 75;
    lastMouseY = rect.top + 75;

    moveMagnifyingGlass(lastMouseX, lastMouseY);
}

// Position the glass and reveal the map
function moveMagnifyingGlass(clientX, clientY) {
    const rect = game.getBoundingClientRect();

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const glassWidth = magnifyingGlass.offsetWidth;
    const glassHeight = magnifyingGlass.offsetHeight;

    // Align the lens centre with the cursor
    const SHIFT_X = 8;
    const SHIFT_Y = 0;
    magnifyingGlass.style.left =
        (x - glassWidth * LENS_X + SHIFT_X) + "px";

    magnifyingGlass.style.top =
        (y - glassHeight * LENS_Y + SHIFT_Y) + "px";

    // Reveal the area underneath the lens
    darkOverlay.style.setProperty("--mouse-x", x + "px");
    darkOverlay.style.setProperty("--mouse-y", y + "px");
    darkOverlay.style.setProperty("--reveal-radius", "48px");

    // Check if Pip has been found
    checkForPip(clientX, clientY);
}

// Detect Pip
function checkForPip(clientX, clientY) {
    if (!gameStarted || pipFound) return;

    const targetRect = pipTarget.getBoundingClientRect();

    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;

    const distance = Math.hypot(
        clientX - targetX,
        clientY - targetY
    );

    if (distance < 45) {
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

// Click the title to start
startButton.addEventListener("click", startGame);

// Keyboard controls for the title
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
