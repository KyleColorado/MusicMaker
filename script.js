// script.js
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let oscillators = [];
let gainNode;
let reverbNode;
let delayNode;
let feedbackGainNode;

// Load an impulse response for the reverb
async function loadReverb() {
    const response = await fetch('path/to/your/impulse-response.wav');
    const arraybuffer = await response.arrayBuffer();
    reverbNode.buffer = await audioCtx.decodeAudioData(arraybuffer);
}

function setupAudioNodes() {
    gainNode = audioCtx.createGain();
    reverbNode = audioCtx.createConvolver();
    delayNode = audioCtx.createDelay();
    feedbackGainNode = audioCtx.createGain();

    delayNode.delayTime.value = parseFloat(document.getElementById('delayTime').value);
    feedbackGainNode.gain.value = parseFloat(document.getElementById('feedbackLevel').value);
    gainNode.gain.value = 0.3;

    delayNode.connect(feedbackGainNode);
    feedbackGainNode.connect(delayNode);
    gainNode.connect(delayNode);
    delayNode.connect(reverbNode);
    reverbNode.connect(audioCtx.destination);

    loadReverb(); // Load the impulse response
}

function playChord() {
    setupAudioNodes();
    const rootFrequency = 220; // A3
    const thirdFrequency = rootFrequency * Math.pow(2, 4/12); // C#4
    const fifthFrequency = rootFrequency * Math.pow(2, 7/12); // E4
    const frequencies = [rootFrequency, thirdFrequency, fifthFrequency];

    stopChord(); // Stop existing sounds

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
document.getElementById('reverbLevel').addEventListener('input', function() {
    reverbNode.buffer = parseFloat(this.value);
});
document.getElementById('delayTime').addEventListener('input', function() {
    delayNode.delayTime.value = parseFloat(this.value);
});
document.getElementById('feedbackLevel').addEventListener('input', function() {
    feedbackGainNode.gain.value = parseFloat(this.value);
});
