var emgCanvas = {
    initEmgCanvas: function(context) {
        this._setContext(context);
        this._xCount = 50;
        this._xLength = 500;
        this._yLength = 300;
        this._initContainer();
    },
    _setXspacing: function(spacing) {
        this._xSpacing = spacing;
    },
    _setY: function(startPoint, endPoint) {
        this._yStart = startPoint;
        this._yEnd = endPoint;
    },
    _setContext : function(context) {
        this._context = context;
    },
    _initContainer : function() {
        this._container = new Array(this._xCount);
        for(let i =0; i<this._container.length; i++) {
            this._container[i] = 0;
        }
    },
    pushValue: function(value) {
        this._container.shift();
        this._container.push(value);
    },
    draw: function() {
        this._context.clearRect(0, 0, this._xLength, this._yLength);
        let xStep = this._xLength / this._xCount;
        let yStartPoint = (this._container[0] - this._yStart) /(this._yEnd - this._yStart) * this._yLength;
        this._context.moveTo(0, yStartPoint);
        for(let i = 1; i < this._container.length; i++) {
            let yPoint = (this._container[i] - this._yStart) / (this._yEnd - this._yStart) * 300;
            this._context.lineTo(i*xStep, yPoint);
        }
        this._context.stroke();
    },
}

window.addEventListener("load",function(){
    var canvas = document.getElementById("ch1");
    var ctx1 = canvas.getContext("2d");
//    ctx1.moveTo(0, 0);
//    ctx1.lineTo(10,30);
//    ctx1.lineTo(20, 10);
//    ctx1.lineTo(30,50);
//    ctx1.lineTo(40, 30);
//    for(let i = 0; i< 50; i++) {
//        ctx1.lineTo(i*10, i*6);
//    }
//    ctx1.stroke();
    var emg1 = Object.create(emgCanvas);
    emg1.initEmgCanvas(ctx1);
    emg1._setXspacing(10);
    emg1._setY(0, 300);
    var initValue = 2;
    setInterval(function(){
        emg1.pushValue(Math.floor(Math.random() * 300));
    },10);
    setInterval(() => {
        console.log("draw canvas");
        emg1.draw();
    }, 1000);
//    let socket = new WebSocket("ws://127.0.0.1:8876");
//    socket.onopen = function(e) {
//        console.log("socket is opne");
//    };
//    socket.onmessage = function(event) {
//        console.log(event);
//    };
//    socket.onclose = function(event) {
//        //alert("socket is closed");
//    }
});