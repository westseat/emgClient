var emgCanvas = {
    initEmgCanvas: function(context) {
        this._setContext(context);
        this._xCount = 100;
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
        //this._context.clearRect(0, 0, this._xLength, this._yLength);
        this._context.clearRect(0, 0, 500, 300);
        let xStep = this._xLength / this._xCount;
        let yStartPoint = (this._container[0] - this._yStart) /(this._yEnd - this._yStart) * this._yLength;
        this._context.beginPath();
        this._context.fillStyle = 'green';
        this._context.moveTo(0, yStartPoint);
        for(let i = 1; i < this._container.length; i++) {
            let yPoint = (this._container[i] - this._yStart) / (this._yEnd - this._yStart) * 300;
            this._context.lineTo(i*xStep, yPoint);
        }
        this._context.stroke();
    },
};

var canvasManager = {
    _canvasContainer: {},
    registerEmgCanvas: function(key, emgObj) {
        this._canvasContainer[key] = emgObj;
    },
    updateCanvas: function() {
        for(key in this._canvasContainer) {
            this._canvasContainer[key].draw();
        }
    },
    pushEmgData: function() {
        for(key in this._canvasContainer) {
           this._canvasContainer[key].pushValue(Math.floor(Math.random() * 300)); 
        }
    }
};

var webSocketManager = {
        initWebSocket: function() {
            console.log("[info]: start to connect socket");
            if(globalContent.wsObj) {
                delete globalContent.wsObj;
            }
            try {
                var self = this;
                this._socket = new WebSocket("ws://127.0.0.1:8876");
                this._socket.onopen = function(e) {
                    globalContent.wsObj = self;
                };
                this._socket.onmessage = function(event) {
                    console.log(event);
                };
                this._socket.onclose = function(event) {
                    console.log("[info]: socket is closed")
                    setTimeout(() => {
                        let wsobj = Object.create(webSocketManager);
                        wsobj.initWebSocket();
                    }, 1000);
                };
                this._socket.onerror = function(error) {
                    console.log(error);
                }
            } catch (error) {
                console.log("[error]: connect to sokcet error");
                setTimeout(() => {
                    let wsobj = Object.create(webSocketManager);
                    wsobj.initWebSocket();
                }, 1000);
            }
    }
};

var globalContent = {};
window.addEventListener("load",function(){
    let chArray = [];
    let ctxArray = [];
    let canvasObj = [];
    for(let i = 1; i<=8; i++) {
        let str = "ch" + i;
        chArray.push(document.getElementById(str));
    }
    for(let i = 1; i<=8; i++) {
        ctxArray.push(chArray[i-1].getContext("2d"));
        let emg = Object.create(emgCanvas);
        emg.initEmgCanvas(ctxArray[i-1]);
        emg._setXspacing(10);
        emg._setY(0,300);
        //canvasObj.push(emg);
        canvasManager.registerEmgCanvas("ch"+i, emg);
    }
//    var ch1 = document.getElementById("ch1");
//    var ch2 = document.getElementById("ch2");
//    var ch3 = document.getElementById("ch3");
//    var ch4 = document.getElementById("ch4");
//    var ch5 = document.getElementById("ch5");
//    var ch6 = document.getElementById("ch6");
//    var ch7 = document.getElementById("ch7");
//    var ch8 = document.getElementById("ch8");
//    var ctx1 = ch1.getContext("2d");
//    var ctx2 = ch2.getContext("2d");
   // ctx1.moveTo(0, 0);
   // ctx1.lineTo(10,30);
   // ctx1.lineTo(20, 10);
   // ctx1.lineTo(30,50);
   // ctx1.lineTo(40, 30);
   // for(let i = 0; i< 50; i++) {
   //     ctx1.lineTo(i*10, i*6);
   // }
   // ctx1.stroke();
   // setTimeout(() => {
   //     ctx1.clearRect(0, 0, 500, 300);
   // }, 2000);
//    var emg1 = Object.create(emgCanvas);
//    emg1.initEmgCanvas(ctx1);
//    emg1._setXspacing(10);
//    emg1._setY(0, 300);
//    var initValue = 2;
    setInterval(function(){
        //for(let i = 0; i< canvasObj.length; i++) {
            //canvasObj[i].pushValue(Math.floor(Math.random() * 300));
            canvasManager.pushEmgData();
        //}
        //emg1.pushValue(Math.floor(Math.random() * 300));
    },200);
 //   setInterval(() => {
 //       emg1._context.clearRect(0, 0, 500, 300);
 //   }, 500);
    setInterval(() => {
        //console.log(emg1._container.length);
        //emg1._context.clearRect(0, 0, 500, 300);
        //console.log("draw canvas");
        //emg1.draw();
      //  for(let i =0; i< canvasObj.length; i++) {
      //      canvasObj[i].draw();
      //  }
      canvasManager.updateCanvas();
    }, 200);
    let ws = Object.create(webSocketManager);
    ws.initWebSocket();
   // let socket = new WebSocket("ws://127.0.0.1:8876");
   // socket.onopen = function(e) {
   //     console.log("socket is opne");
   // };
   // socket.onmessage = function(event) {
   //     console.log(event);
   // };
   // socket.onclose = function(event) {
   //     //alert("socket is closed");
   // }
});