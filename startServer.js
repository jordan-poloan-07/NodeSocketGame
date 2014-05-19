// node arguments 
var args = process.argv.slice(2);
var SERVER = args[0] || "localhost"; // 
var PORT = args[1] || 3700; // verify if 4 digit number 

// server global variables
var objs = [{
    x: 200,
    y: -20
}, {
    x: 600,
    y: -20
}];

var users = {};

// requirements
var express = require("express");
var jade = require("jade");
var socketIO = require("socket.io");

// server initialization
var server = express();
server.set('views', __dirname + '/templates');
server.set('view engine', 'jade');
server.engine('jade', jade.__express);
server.use(express.static(__dirname + '/public'));

server.get("/", function(req, res) {
    res.render("index", {
        serverAddr: SERVER,
        port: PORT
    });
});

var serverSocket = socketIO.listen(server.listen(PORT), {
    log: false
});

serverSocket.sockets.on('connection', function(socket) {

    var userCount = Object.keys(users).length;

    if (userCount < 2) {

        users[socket.id] = objs[userCount];

        status_emitter();

        socket.on('keypress', function(data) {
            users[socket.id].x = data.x;
            users[socket.id].y = data.y;
        });

        socket.on('disconnect', function() {
            delete users[socket.id];
        });

    } else {
        return;
    }

});

setInterval(function() {
    status_emitter();
}, 50);

function status_emitter() {
    var userCount = Object.keys(users).length;
    var status = (userCount < 2) ? 'waiting' : 'playing';
    serverSocket.sockets.volatile.emit('status', {
        status: status,
        users: users
    });
}

console.log("Established server at " + SERVER + " in port " + PORT);
