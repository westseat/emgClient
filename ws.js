var emgCanvas = {
    initEmgCanvas: function(context) {
        this._setContext(context);
        this._xCount = 100;
        this._width = context.canvas.width;
        this._height = context.canvas.height;
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
        this._container = new Array(this._xCount+1);
        for(let i =0; i<this._container.length; i++) {
            this._container[i] = 0;
        }
    },
    pushValue: function(value) {
        this._container.shift();
        this._container.push(value);
    },
    draw: function() {
        this._context.clearRect(0, 0, this._width, this._height);
        let xStep = this._width / this._xCount;
        let yStartPoint = this._height - (this._container[0] - this._yStart) /(this._yEnd - this._yStart) * this._height;
        this._context.beginPath();
        this._context.strokeStyle = "blue";
        this._context.moveTo(0, yStartPoint);
        for(let i = 1; i < this._container.length; i++) {
            let yPoint = this._height - (this._container[i] - this._yStart) / (this._yEnd - this._yStart) * 300;
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
    pushEmgData: function(emgJson) {
        for(key in this._canvasContainer) {
            this._canvasContainer[key].pushValue(parseInt(emgJson[key]));
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
                    console.log("socket is connected");
                    globalContent.wsObj = self;
                };
                this._socket.onmessage = function(event) {
/* { version: "1.0",
           type: "emg",
           ch1Average: "1512",
           ch1Value: "1513",
           ch1Powser: "1",
           ch1Strength: "0",
           ch2Average: "1506",
           ch2Value: "1506",
           ch2Power: "1",
           ch2Strength: "0" } */
                    if(!event.data)
                        return;
                    let emgJson = JSON.parse(event.data);
                    //console.log(emgJson);
                    canvasManager.pushEmgData(emgJson);
                };
                this._socket.onclose = function(event) {
                    console.log("[info]: socket is closed")
                    setTimeout(() => {
                        let wsobj = Object.create(webSocketManager);
                        wsobj.initWebSocket();
                    }, 1000);
                };
                this._socket.onerror = function(error) {
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
    let array1 = ["ch1Average","ch1Value","ch2Average","ch2Value"];
    let array2 = ["ch1Power","ch1Strength","ch2Power","ch2Strength"];
    for(let i = 0; i<array1.length; i++) {
        let ctx = document.getElementById(array1[i]).getContext("2d");
        let emgObj = Object.create(emgCanvas);
        emgObj.initEmgCanvas(ctx);
        emgObj._setXspacing(10);
        emgObj._setY(1500, 1600);
        canvasManager.registerEmgCanvas(array1[i], emgObj);
    }
    for(let i=0; i< array2.length; i++) {
        let ctx = document.getElementById(array2[i]).getContext("2d");
        let emgObj = Object.create(emgCanvas);
        emgObj.initEmgCanvas(ctx);
        emgObj._setXspacing(10);
        emgObj._setY(0, 300);
        canvasManager.registerEmgCanvas(array2[i], emgObj);
    }

    setInterval(() => {
      canvasManager.updateCanvas();
    }, 50);
    let ws = Object.create(webSocketManager);
    ws.initWebSocket();
});