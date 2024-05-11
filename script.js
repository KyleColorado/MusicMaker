const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let oscillators = [];
let gainNode = audioCtx.createGain();
let reverbNode = audioCtx.createConvolver();
let delayNode = audioCtx.createDelay();
let feedbackGainNode = audioCtx.createGain();

// Load an impulse response for the reverb
async function loadReverb() {
    try {
        const response = await fetch('path/to/your/impulse-response.wav');
        const arraybuffer = await response.arrayBuffer();
        reverbNode.buffer = await audioCtx.decodeAudioData(arraybuffer);
    } catch (error) {
        console.error('Failed to load impulse response:', error);
    }
}

function setupAudioNodes() {
    // Default settings
    gainNode.gain.value = 0.5;
    delayNode.delayTime.value = 0.2;
    feedbackGainNode.gain.value = 0.5;

    // Connect nodes
    gainNode.connect(delayNode);
    delayNode.connect(feedbackGainNode);
    feedbackGainNode.connect(delayNode); // Feedback loop
    delayNode.connect(reverbNode);
    reverbNode.connect(audioCtx.destination);

    // Load reverb file
    loadReverb();
}

function playChord() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    stopChord(); // Stop existing sounds

    const rootFrequency = 220; // A3
    const thirdFrequency = rootFrequency * Math.pow(2, 4/12); // C#4
    const fifthFrequency = rootFrequency * Math.pow(2, 7/12); // E4
    const frequencies = [rootFrequency, thirdFrequency, fifthFrequency];

    frequencies.forEach(freq => {
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

document.addEventListener('DOMContentLoaded', function() {
    setupAudioNodes();

    document.getElementById('playPad').addEventListener('click', playChord);
    document.getElementById('stopPad').addEventListener('click', stopChord);

    document.getElementById('reverbLevel').addEventListener('input', function() {
        gainNode.gain.value = parseFloat(this.value);
    });

    document.getElementById('delayTime').addEventListener('input', function() {
        delayNode.delayTime.value = parseFloat(this.value);
    });

    document.getElementById('feedbackLevel').addEventListener('input', function() {
        feedbackGainNode.gain.value = parseFloat(this.value);
    });
});
