var context = new AudioContext();
var mediaElement = document.getElementById('audio1');
    mediaElement.crossOrigin = "anonymous";
var sourceNode = context.createMediaElementSource(mediaElement);
var analyser = context.createAnalyser();


// EQ Properties
//
var gainDb = -40.0;
var bandSplit = [360, 3600];

var hBand = context.createBiquadFilter();
    hBand.type = "lowshelf";
    hBand.frequency.value = bandSplit[0];
    hBand.gain.value = gainDb;

var hInvert = context.createGain();
    hInvert.gain.value = -1.0;

var mBand = context.createGain();

var lBand = context.createBiquadFilter();
    lBand.type = "highshelf";
    lBand.frequency.value = bandSplit[1];
    lBand.gain.value = gainDb;

var lInvert = context.createGain();
    lInvert.gain.value = -1.0;

    sourceNode.connect(lBand);
    sourceNode.connect(mBand);
    sourceNode.connect(hBand);

    hBand.connect(hInvert);
    lBand.connect(lInvert);

    hInvert.connect(mBand);
    lInvert.connect(mBand);

var lGain = context.createGain();
var mGain = context.createGain();
var hGain = context.createGain();

    lBand.connect(lGain);
    mBand.connect(mGain);
    hBand.connect(hGain);

var sum = context.createGain();
    lGain.connect(sum);
    mGain.connect(sum);
    hGain.connect(sum);
    sum.connect(context.destination);

// Input
//
function changeGain(string, type) {
    var value = parseFloat(string) / 100.0;

    switch (type) {
        case 'lowGain':
            lGain.gain.value = value;
            break;
        case 'midGain':
            mGain.gain.value = value;
            break;
        case 'highGain':
            hGain.gain.value = value;
            break;
    }
}
//visualizer

sourceNode.connect(analyser);
analyser.connect(context.destination);

var frequencyData = new Uint8Array(analyser.frequencyBinCount);

// we're ready to receive some data!
var canvas = document.getElementById('canvas'),
    cwidth = canvas.width,
    cheight = canvas.height - 2,
    meterWidth = 10, //width of the meters in the spectrum
    gap = 2, //gap between meters
    capHeight = 2,
    capStyle = '#fff',
    meterNum = 800 / (10 + 2), //count of the meters
    capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
    context = canvas.getContext('2d'),
    gradient = context.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(1, '#34495E');
    gradient.addColorStop(0.5, '#0095D8');
    gradient.addColorStop(0, 'rgb(135, 206, 235)');

// loop
function renderFrame() {
    var array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    var step = Math.round(array.length / meterNum); //sample limited data from the total array
    context.clearRect(0, 0, cwidth, cheight);
    for (var i = 0; i < meterNum; i++) {
        var value = array[i * step];
        if (capYPositionArray.length < Math.round(meterNum)) {
            capYPositionArray.push(value);
        };
        context.fillStyle = capStyle;
        //draw the cap, with transition effect
        if (value < capYPositionArray[i]) {
            context.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
        } else {
            context.fillRect(i * 12, cheight - value, meterWidth, capHeight);
            capYPositionArray[i] = value;
        };
        context.fillStyle = gradient; //set the filllStyle to gradient for a better look
        context.fillRect(i * 12, cheight - value + capHeight, meterWidth, cheight); //the meter
    }
    requestAnimationFrame(renderFrame);
}
renderFrame();
