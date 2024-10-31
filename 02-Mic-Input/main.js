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
        this.initRAF();

        this.initMicInteraction();

        this.updateCanvasSize();
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

    initMicInteraction() {
        var _this = this;

        // Check if the browser supports audio input
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    _this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    _this.analyser = _this.audioContext.createAnalyser();
                    _this.analyser.fftSize = 256; // Size of the FFT. Higher values give more frequency bars.

                    _this.source = _this.audioContext.createMediaStreamSource(stream);
                    _this.source.connect(_this.analyser);

                    _this.bufferLength = _this.analyser.frequencyBinCount;
                    _this.dataArray = new Uint8Array(_this.bufferLength);
                })
                .catch(error => {
                    console.error("Microphone access was denied or not available:", error);
                });
        } else {
            alert("getUserMedia not supported on your browser!");
        }
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
        const frequencySelected = 20;
        let frequencyIntensity = this.dataArray[frequencySelected];

        // Light up the background when reaching certain height
        let threshold = 70;
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
    if (myApp && myApp.analyser) {
        myApp.draw();
    }

    requestAnimationFrame(frame);
}





// Inicializar nuestro código
var myApp;

window.onload = function () {
    myApp = new App();
};