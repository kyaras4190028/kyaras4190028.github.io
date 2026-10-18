
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const darkOverlay = document.getElementById("dark-overlay");
const magnifyingGlass = document.getElementById("magnifying-glass");
const game = document.querySelector(".game");

let gameStarted = false;

// Start the game when the title image is clicked
function startGame() {
    if (gameStarted) return;

    gameStarted = true;

    // Hide the starting title
    startScreen.style.display = "none";

    // Activate the dark overlay
    darkOverlay.classList.add("active");

    // Show the magnifying glass
    magnifyingGlass.style.display = "block";
}

// Click the title image to start
startButton.addEventListener("click", startGame);

// Also allow the title to be activated using a keyboard
startButton.addEventListener("keydown", function(event) {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        startGame();
    }
});

// Move the magnifying glass and its reveal with the cursor
document.addEventListener("mousemove", function(event) {
    if (!gameStarted) return;

    const gameRect = game.getBoundingClientRect();

    // Cursor position relative to the game
    const x = event.clientX - gameRect.left;
    const y = event.clientY - gameRect.top;

    // Move the glass so its centre follows the cursor
    magnifyingGlass.style.left = (x - 75) + "px";
    magnifyingGlass.style.top = (y - 75) + "px";

    // Move the transparent reveal to the same position
    darkOverlay.style.setProperty("--mouse-x", x + "px");
    darkOverlay.style.setProperty("--mouse-y", y + "px");
});
