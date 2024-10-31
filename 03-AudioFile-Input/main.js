/*
    
*/

const PI2 = Math.PI * 2;
var halfCanvas = {
    x: 0,
    y: 0,
}

class App {
    constructor(params = {}) {
        this.initCanvas();
        this.initAudioFileInteraction();

        this.updateCanvasSize();
        this.initRAF();
    }


    initCanvas() {
        this.canvas = document.getElementById("lienzo");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = this.canvas.getBoundingClientRect().width;
        this.canvas.height = this.canvas.getBoundingClientRect().height;

        window.addEventListener("resize", this.updateCanvasSize.bind(this));
    }

    updateCanvasSize() {
        console.log('updateCanvasSize');

        this.canvas.width = this.canvas.getBoundingClientRect().width;
        this.canvas.height = this.canvas.getBoundingClientRect().height;

        halfCanvas.x = this.canvas.width / 2;
        halfCanvas.y = this.canvas.height / 2;

        this.attractorPoint = { x: halfCanvas.x, y: halfCanvas.y };

        if (this.render) {
            this.render.options.width = this.canvas.width;
            this.render.options.height = this.canvas.height;
        }
    }


    async initAudioFileInteraction() {
        this.audio = document.getElementById("audio");

        // Wait until the audio is loaded and ready to play
        await this.waitForAudioLoad(this.audio).then(() => {
            // Start playback or further initialization here
            this.audio.setAttribute('controls', true);
            
        });
        
        this.audio.addEventListener("play", this.setupAudioContext.bind(this));
    }

    async waitForAudioLoad(audio) {
        if (audio.readyState >= 3) { // 'HAVE_FUTURE_DATA' or 'HAVE_ENOUGH_DATA' means the audio is ready
            console.log("Audio is ready to play!");
            return;
        }
      
        return new Promise((resolve) => {
            audio.addEventListener("loadeddata", resolve, { once: true });
        }).then(() => console.log("Audio is ready to play!"));
    }

    setupAudioContext() {
        if (this.audioContext) return;

        // Create audio context and analyser node
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256 * 1; // Size of the FFT for frequency data
        
        // Create source node from the audio element and connect it to the analyser
        this.source = this.audioContext.createMediaElementSource(this.audio);
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);

        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
    }
    
    draw() {
        this.analyser.getByteFrequencyData(this.dataArray);

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Set bar properties
        const barWidth = (this.canvas.width / this.bufferLength) * 1;
        let barHeight;
        let x = 0;


        // Select "frequency" to be used as threshold or interaction
        const frequencySelected = this.bufferLength / 4;
        let frequencyIntensity = this.dataArray[frequencySelected];

        // Light up the background when reaching certain height
        let threshold = 100;
        if (frequencyIntensity > threshold) {
            this.ctx.fillStyle = `rgb(255, 250, 200)`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // Draw bars logic
        for (let i = 0; i < this.bufferLength; i++) {
            barHeight = this.dataArray[i];

            // Set color for each bar based on frequency amplitude
            this.ctx.fillStyle = `rgb(${barHeight + 100}, 50, 200)`;
            this.ctx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);

            // Move to the next bar position
            x += barWidth + 1;
        }

        // Draw the threshold mark on top of everything
        let xPos = (barWidth + 1) * frequencySelected;
        this.ctx.fillStyle = `rgb(0, 255, 255)`;
        this.ctx.fillRect(xPos, this.canvas.height - threshold, barWidth, 2);
    }



    initRAF() {
        frame();
    }
}


function frame() {
    // console.log("custom animation frame interval");

    // Prevent drawing until Audio and Analyser were set up
    if (myApp && myApp.audio && myApp.analyser) {
        myApp.draw();
    }

    requestAnimationFrame(frame);
}





// Inicializar nuestro código
var myApp;

window.onload = function () {
    myApp = new App();
};