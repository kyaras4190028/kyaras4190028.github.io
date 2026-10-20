const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const darkOverlay = document.getElementById("dark-overlay");
const magnifyingGlass = document.getElementById("magnifying-glass");
const pipTarget = document.getElementById("pip-target");
const winScreen = document.getElementById("win-screen");
const playAgain = document.getElementById("play-again");
const game = document.querySelector(".game");
// I selected the HTML elements indic=vidually so JavaScript could control their visibility and respond to userrr actions. Separating these elements makes it easier to manage the differ4ent parts of the game, including the starting screen, magnifying class, and congratulatory popup. This approach allows for a more organized and maintainable code structure, making it easier to implement game logic and user interactions.//

let gameStarted = false;
let pipFound = false;

// Initial cursor position
let lastMouseX = window.innerWidth - 75;
let lastMouseY = 75;
//I set an initial cursor position near the top-right corner of the game area to provide a starting point for the magnifying glass. This ensures that players begin the game with a clear view of the map and can start searching for Pip immediately. I had Google help me to implement this feature.//

//Lens position relative to the magnifying glass
const LENS_X = 0.376;
const LENS_Y = 0.349;
//I used these constants to define the position of the lens relative to the magnifying glass image. This allows for accurate alignment of the magnifying glass effect with the cursor, ensuring that the area revealed by the lens corresponds correctly to the underlying map. I had ChatGPT guide me to implement this feature, but did the sizing and measuring myself.//

// Start the game
function startGame() {
    if (gameStarted) return;
//I added a check to prevent the game from starting multiple times if the start button is clicked again. This ensures that the game logic is only initialized once, preventing potential issues with overlapping game states or unintended behavior.//
    gameStarted = true;
    pipFound = false;

    startScreen.style.display = "none";
    darkOverlay.classList.add("active");
    magnifyingGlass.style.display = "block";
//I hid the title screen after it is clicked so the player can focus on the game. I also made the dark overlay and magnifying glass visible to create the effect of searching for Pip. This transition enhances the user experience by providing a clear visual cue that the game has started and the player can begin their search.//

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
// I calculated the position of the magnifying glass relative to the game area to ensure that it follows the cursor accurately. This allows for a smooth and responsive user experience as players move the magnifying glass over the map to search for Pip.//

    // Align the lens centre with the cursor
    const SHIFT_X = 8;
    const SHIFT_Y = -5;
    magnifyingGlass.style.left =
        (x - glassWidth * LENS_X + SHIFT_X) + "px";

    magnifyingGlass.style.top =
        (y - glassHeight * LENS_Y + SHIFT_Y) + "px";
// I adjusted the position of the magnifying glass to align the lens center with the cursor. This ensures that the area revealed by the magnifying glass corresponds accurately to the cursor's position, enhancing the player's ability to search for Pip effectively. I had the help of ChatGPT to help me create this function as I couldn't figure out how to make it work.//
    
    // Reveal the area underneath the lens
    darkOverlay.style.setProperty("--mouse-x", x + "px");
    darkOverlay.style.setProperty("--mouse-y", y + "px");
    darkOverlay.style.setProperty("--reveal-radius", "48px");
// I created the dark overlay to reveal the area underneath the magnifying glass. This creates the effect of a circular lens that allows players to see the map clearly in the area they are searching, enhancing the gameplay experience.//

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
// I had to ask for help from Youtube to implement the checkForPip function. I used the distance formula to determine if the cursor is close enough to Pip's position to consider him found. It was pretty hard to figure out, and I had to search multiple sources to understand how to implement it correctly.//

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
//I connected the title image to the start function do the players can choose when to enter the game rather than starting the interaction automatically.//

// Restart the game
playAgain.addEventListener("click", function() {
    pipFound = false;
    gameStarted = false;

    winScreen.style.display = "none";
    startScreen.style.display = "flex";
    darkOverlay.classList.remove("active");
    magnifyingGlass.style.display = "none";
});
//I reset the game state and hide the winning screen when the "Play again" button is clicked. This allows players to restart the game and search for Pip again. I had to get some help from YouTube tutorials and ChatGPT guiding me to implement this feature.//

//Overall, I was alot more confident in using JavaScript this time around compared to the last assignment. However, I was still struggling with my knowledge. i tried to listen to previoues feedback where I had to rely less on other sources. However, there were alot of times where I would guess and it wouldn't work out. That was when I started searching for help through YouTube and ChatGPT. Nonetheless, I didn't rely on them as much as I did in the last assignment. I was able to figure out alot of the code on my own, but there were still some parts where I had to get help. Overall, I feel like I improved my JavaScript skills and learned more about how to use it effectively in a project.//