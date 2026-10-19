
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const darkOverlay = document.getElementById("dark-overlay");
const magnifyingGlass = document.getElementById("magnifying-glass");
const pipTarget = document.getElementById("pip-target");
const winScreen = document.getElementById("win-screen");
const keepExploring = document.getElementById("keep-exploring");
const playAgain = document.getElementById("play-again");
const game = document.querySelector(".game");

let gameStarted = false;
let pipFound = false;

// Remember the cursor's most recent position
let lastMouseX = window.innerWidth / 2;
let lastMouseY = window.innerHeight / 2;

// Start the game when the title is clicked
function startGame() {
    if (gameStarted) return;

    gameStarted = true;
    pipFound = false;

    startScreen.style.display = "none";
    darkOverlay.classList.add("active");
    magnifyingGlass.style.display = "block";

    moveMagnifyingGlass(lastMouseX, lastMouseY);
}

// Move the magnifying glass and the reveal circle
function moveMagnifyingGlass(clientX, clientY) {
    const gameRect = game.getBoundingClientRect();

    const x = clientX - gameRect.left;
    const y = clientY - gameRect.top;

    // Centre the PNG on the cursor
    magnifyingGlass.style.left =
        (x - magnifyingGlass.offsetWidth / 2) + "px";

    magnifyingGlass.style.top =
        (y - magnifyingGlass.offsetHeight / 2) + "px";

    // Keep the clear area aligned with the cursor
    darkOverlay.style.setProperty("--mouse-x", (x - 15) + "px");
    darkOverlay.style.setProperty("--mouse-y", (y + 10) + "px");

    // Check whether the cursor has reached Pip
    checkForPip(clientX, clientY);
}

// Check the distance between the cursor and Pip
function checkForPip(clientX, clientY) {
    if (!gameStarted || pipFound) return;

    const targetRect = pipTarget.getBoundingClientRect();

    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;

    const distance = Math.hypot(
        clientX - targetX,
        clientY - targetY
    );

    // Show the congratulations message when Pip is found
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

// Click the title to begin
startButton.addEventListener("click", startGame);

// Allow keyboard users to start the game too
startButton.addEventListener("keydown", function(event) {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        startGame();
    }
});

// Close the popup and continue exploring
keepExploring.addEventListener("click", function() {
    winScreen.style.display = "none";
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
