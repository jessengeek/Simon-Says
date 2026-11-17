// Simon Says Game Logic

const colors = ['green', 'red', 'yellow', 'blue'];
const sounds = {};
let gameSequence = [];
let playerSequence = [];
let level = 0;
let score = 0;
let gameActive = false;
let isPlayerTurn = false;
let waitingForInput = false;

const startBtn = document.getElementById('startBtn');
const levelDisplay = document.getElementById('level');
const scoreDisplay = document.getElementById('score');
const messageDisplay = document.getElementById('message');
const colorBtns = document.querySelectorAll('.color-btn');

// Initialize sounds
function initializeSounds() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    sounds.green = () => playSound(261.63);
    sounds.red = () => playSound(329.63);
    sounds.yellow = () => playSound(392.00);
    sounds.blue = () => playSound(523.25);

    function playSound(frequency) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
}

// Flash a button
function flashButton(color) {
    const btn = document.getElementById(color);
    btn.classList.add('active');
    sounds[color]();
    
    setTimeout(() => {
        btn.classList.remove('active');
    }, 300);
}

// Display the computer sequence
async function displaySequence() {
    isPlayerTurn = false;
    messageDisplay.textContent = 'Watch the sequence!';
    messageDisplay.classList.remove('error', 'success');
    
    for (let i = 0; i < gameSequence.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 600));
        flashButton(gameSequence[i]);
    }
    
    isPlayerTurn = true;
    messageDisplay.textContent = 'Your turn! Repeat the sequence.';
    messageDisplay.classList.add('success');
}

// Start a new round
function nextRound() {
    playerSequence = [];
    level++;
    score = level * 10;
    levelDisplay.textContent = level;
    scoreDisplay.textContent = score;
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    gameSequence.push(randomColor);
    
    displaySequence();
}

// Handle button click
function handleButtonClick(e) {
    if (!isPlayerTurn || !gameActive) return;
    
    const color = e.target.dataset.color;
    playerSequence.push(color);
    flashButton(color);
    
    // Check if player's sequence is correct
    const lastIndex = playerSequence.length - 1;
    if (playerSequence[lastIndex] !== gameSequence[lastIndex]) {
        gameOver();
        return;
    }
    
    // Check if player completed the sequence
    if (playerSequence.length === gameSequence.length) {
        isPlayerTurn = false;
        messageDisplay.textContent = `Great! Level ${level} complete.`;
        messageDisplay.classList.add('success');
        setTimeout(() => {
            nextRound();
        }, 800);
    }
}

// Game Over
function gameOver() {
    gameActive = false;
    isPlayerTurn = false;
    messageDisplay.textContent = `Game Over! Final Level: ${level}`;
    messageDisplay.classList.add('error');
    startBtn.disabled = false;
    startBtn.textContent = 'Try Again';
}

// Start the game
function startGame() {
    gameSequence = [];
    playerSequence = [];
    level = 0;
    score = 0;
    gameActive = true;
    isPlayerTurn = false;
    
    levelDisplay.textContent = level;
    scoreDisplay.textContent = score;
    messageDisplay.textContent = '';
    messageDisplay.classList.remove('error', 'success');
    
    startBtn.disabled = true;
    
    setTimeout(() => {
        nextRound();
    }, 500);
}

// Event listeners
startBtn.addEventListener('click', startGame);

colorBtns.forEach(btn => {
    btn.addEventListener('click', handleButtonClick);
});

// Initialize sounds on first user interaction
document.addEventListener('click', () => {
    if (!Object.keys(sounds).length) {
        initializeSounds();
    }
}, { once: true });