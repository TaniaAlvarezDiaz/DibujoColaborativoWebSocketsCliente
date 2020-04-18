var users = 0;
var canvas;
var websocket = new WebSocket('ws://localhost:9001');

window.addEventListener("load", init);

function init() {
    configureCanvas();
    configureButtons();
    initServer();
}

function configureCanvas() {
    canvas = new fabric.Canvas('canvas');
    canvas.freeDrawingBrush.color = 'green';
    canvas.freeDrawingBrush.lineWidth = 10;
}

function configureButtons() {
    document.getElementById("addCircle").addEventListener('click', addCircleHandler);
    document.getElementById("addRectangle").addEventListener('click', addRectangleHandler);
    document.getElementById("addTriangle").addEventListener('click', addTriangleHandler);
    document.getElementById("pencil").addEventListener('click', pencilHandler);
    document.getElementById("selection").addEventListener('click', selectionHandler);
}

function initServer() {
    websocket.onopen = connectionOpen;
    websocket.onmessage = onMessageFromServer;
}

function connectionOpen() {
    websocket.send('connection open');
}

function onMessageFromServer(message) {
    if (isJson(message.data)) {
        var obj = JSON.parse(message.data);
        //Update canvas
        for (var i in obj.figures) {
            var f = obj.figures[i];
            addObject(f.type, f.data);
        }
        //Paint the objects
        canvas.renderAll();
        //Update users
        document.getElementById("users").innerHTML = obj.users;
    }   
}

function isJson(str) {
    try {
        JSON.parse(str);
    }catch (e) {
        return false;
    }
    return true;
}

function addObject(type, obj) {
    var shape;
    if (type == 'Triangle') {
        shape = new fabric.Triangle(obj);
    }else if (type == 'Rectangle') {
        shape = new fabric.Rect(obj);
    }else if (type == 'Circle') {
        shape = new fabric.Circle(obj);
    }
    canvas.add(shape);
}

function sendObject(type, obj) {
    websocket.send(JSON.stringify({'type': type, 'data': obj}));
}

/* BUTTONS FUNCTIONS */
function addCircleHandler() {
    var obj = {
        top: 250,
        left: 50,
        radius: 30,
        fill: 'green'
    };
    sendObject('Circle', obj);
}

function addRectangleHandler() {
    var obj = {
        top: 150,
        left: 50,
        width: 60,
        height: 70,
        fill: 'red'
    };
    sendObject('Rectangle', obj);
}

function addTriangleHandler() {
    var obj = {
        top: 50,
        left: 50,
        width: 60,
        height: 70,
        fill: 'blue'
    };
    sendObject('Triangle', obj);
}

function pencilHandler() {
    canvas.isDrawingMode = true;
}

function selectionHandler() {
    canvas.isDrawingMode = false;
}

/* FIN BUTTONS FUNCTIONS */
