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

var serverSocket = socketIO.listen(server.listen(PORT));

serverSocket.sockets.on('connection', function(socket) {

    if (Object.keys(users).length < 2) {

        users[socket.id] = objs[Object.keys(users).length];

        status_emitter();
        
        socket.on('keypress', function(data) {
            users[data.user].x = data.x;
            users[data.user].y = data.y;
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
}, 1000);

function status_emitter() {
    var userCount = Object.keys(users).length;
    var status = (userCount < 2) ? 'waiting' : 'playing';
    var theUsers = users;
    serverSocket.sockets.emit('status', {
        status: status,
        users: theUsers
    });
}

console.log("Established server : " + SERVER + " in port " + PORT);
