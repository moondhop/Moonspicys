// ============ DOM Elements ============
const splashScreen = document.getElementById('splashScreen');
const mainContainer = document.getElementById('mainContainer');
const playBtn = document.getElementById('play-btn');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const confettiBtn = document.getElementById('confettiBtn');
const soundBtn = document.getElementById('soundBtn');
const confettiCanvas = document.getElementById('confetti');
const ctx = confettiCanvas.getContext('2d');

// ============ CONFIG ============
const NAME = 'SABA';
const BIRTHDAY_MESSAGES = [
    `Happy Birthday ${NAME}! 🎂`,
    `Wishing you a year full of joy! 🌟`,
    `May all your dreams come true! 💫`,
    `You deserve the best today! 👑`,
    `Let's celebrate YOU! 🥳`
];

// ============ STATE ============
let isMusicPlaying = false;
let particles = [];

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', () => {
    initializeCanvas();
    setupEventListeners();
    prefetchAudio();
});

function initializeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    });
}

function setupEventListeners() {
    playBtn.addEventListener('click', startCelebration);
    musicToggle.addEventListener('click', toggleMusic);
    confettiBtn.addEventListener('click', triggerConfetti);
    soundBtn.addEventListener('click', playCheeringSound);
    window.addEventListener('resize', () => {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    });
}

// ============ START CELEBRATION ============
function startCelebration() {
    // Hide splash, show main
    splashScreen.style.display = 'none';
    mainContainer.style.display = 'block';

    // Start animations
    setTimeout(() => {
        initializeTypedAnimation();
        triggerConfetti();
        playBackgroundMusic();
    }, 300);
}

// ============ TYPED ANIMATION ============
function initializeTypedAnimation() {
    if (typeof Typed !== 'undefined') {
        new Typed('#typed', {
            strings: BIRTHDAY_MESSAGES,
            typeSpeed: 50,
            delaySpeed: 100,
            backSpeed: 40,
            backDelay: 2000,
            loop: true,
            cursorChar: '|',
            smartBackspace: true,
        });
    }
}

// ============ MUSIC CONTROL ============
function prefetchAudio() {
    if (bgMusic) {
        bgMusic.preload = 'auto';
    }
}

function toggleMusic() {
    if (!bgMusic) return;

    if (bgMusic.paused) {
        playBackgroundMusic();
    } else {
        bgMusic.pause();
        isMusicPlaying = false;
        updateMusicButton();
    }
}

function playBackgroundMusic() {
    if (!bgMusic) return;

    bgMusic.volume = 0.4;
    const playPromise = bgMusic.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                isMusicPlaying = true;
                updateMusicButton();
            })
            .catch(() => {
                console.log('Audio playback failed - user may need to interact first');
            });
    }
}

function updateMusicButton() {
    const icon = musicToggle.querySelector('i');
    if (isMusicPlaying) {
        icon.classList.remove('fa-music');
        icon.classList.add('fa-pause');
        musicToggle.style.opacity = '1';
    } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-music');
        musicToggle.style.opacity = '0.7';
    }
}

// ============ CONFETTI ANIMATION ============
function triggerConfetti() {
    // Create confetti particles
    for (let i = 0; i < 100; i++) {
        particles.push(createConfettiParticle());
    }

    // Animate confetti
    animateConfetti();
}

function createConfettiParticle() {
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#667eea', '#764ba2'];
    return {
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height - confettiCanvas.height,
        width: Math.random() * 10 + 5,
        height: Math.random() * 10 + 5,
        opacity: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 5 + 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
    };
}

function animateConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.01;

        // Draw particle
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        ctx.restore();

        // Remove dead particles
        if (p.opacity <= 0 || p.y > confettiCanvas.height) {
            particles.splice(i, 1);
        }
    }

    // Continue animation if there are particles
    if (particles.length > 0) {
        requestAnimationFrame(animateConfetti);
    }
}

// ============ SOUND EFFECTS ============
function playCheeringSound() {
    // Create audio context for sound effect
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        playCheerSound(audioContext);
    } catch (e) {
        console.log('Web Audio API not supported');
    }
}

function playCheerSound(audioContext) {
    const now = audioContext.currentTime;
    const duration = 0.3;

    // Create oscillator for cheer sound
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.connect(gain);
    gain.connect(audioContext.destination);

    // Cheer frequency sweep
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + duration);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.start(now);
    osc.stop(now + duration);

    // Add secondary harmonic
    setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();

        osc2.connect(gain2);
        gain2.connect(audioContext.destination);

        osc2.frequency.setValueAtTime(300, now + 0.15);
        osc2.frequency.exponentialRampToValueAtTime(500, now + 0.15 + duration);

        gain2.gain.setValueAtTime(0.2, now + 0.15);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.15 + duration);

        osc2.start(now + 0.15);
        osc2.stop(now + 0.15 + duration);
    }, 50);

    // Trigger confetti too
    triggerConfetti();
}

// ============ UTILITY FUNCTIONS ============
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px 40px;
        border-radius: 10px;
        z-index: 10000;
        animation: slideInDown 0.5s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInUp 0.5s ease-in reverse';
        setTimeout(() => notification.remove(), 500);
    }, 1500);
}

// ============ EASTER EGG ============
let clickCount = 0;
const nameDisplay = document.getElementById('nameDisplay');

if (nameDisplay) {
    nameDisplay.addEventListener('click', () => {
        clickCount++;
        if (clickCount >= 3) {
            triggerConfetti();
            playCheeringSound();
            showNotification('🎉 Triple Click Bonus! 🎉');
            clickCount = 0;
        }
    });

    setTimeout(() => {
        clickCount = 0;
    }, 2000);
}

// ============ PAGE VISIBILITY HANDLING ============
document.addEventListener('visibilitychange', () => {
    if (document.hidden && isMusicPlaying && bgMusic) {
        bgMusic.pause();
    }
});

// ============ MOBILE OPTIMIZATION ============
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', () => {
        // Enable audio on first touch
        if (bgMusic && bgMusic.paused) {
            bgMusic.volume = 0.4;
        }
    });
}

console.log('🎉 Happy Birthday SABA! 🎉');
