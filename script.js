// script.js
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let oscillator;
let gainNode;

function playSound() {
    oscillator = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();

    oscillator.type = document.getElementById('waveform').value;
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4 note
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
}

function stopSound() {
    if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
    }
}

document.getElementById('playPad').addEventListener('click', playSound);
document.getElementById('stopPad').addEventListener('click', stopSound);
