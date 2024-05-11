// script.js
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let oscillators = [];
let gainNode;

function playChord() {
    // Define the chord: root, major third, and perfect fifth
    const rootFrequency = 220; // A3
    const thirdFrequency = rootFrequency * Math.pow(2, 4/12); // C#4
    const fifthFrequency = rootFrequency * Math.pow(2, 7/12); // E4

    const frequencies = [rootFrequency, thirdFrequency, fifthFrequency];

    // Stop existing sounds if any
    stopChord();

    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime); // Set volume
    gainNode.connect(audioCtx.destination);

    // Create an oscillator for each note in the chord
    frequencies.forEach((freq) => {
        const oscillator = audioCtx.createOscillator();
        oscillator.type = document.getElementById('waveform').value;
        oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
        oscillator.connect(gainNode);
        oscillator.start();
        oscillators.push(oscillator);
    });
}

function stopChord() {
    oscillators.forEach(osc => {
        osc.stop();
        osc.disconnect();
    });
    oscillators = [];
}

document.getElementById('playPad').addEventListener('click', playChord);
document.getElementById('stopPad').addEventListener('click', stopChord);
