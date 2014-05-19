$(function() {

    var socket = io.connect('http://' + serverAddr + ':' + port);

    var content = $("#content");
    var object = $("#leobject");

    var xVal = $("#you span.x");
    var yVal = $("#you span.y");

    var xValEnemy = $("#enemy span.x");
    var yValEnemy = $("#enemy span.y");

    var status = "waiting";
    var myObject = {};

    // receive updates of the object's
    // status from the server
    socket.on('status', function(data) {

        status = data.status;
        content.text(data.status);

        myObject = data.users[socket.socket.sessionid];

        var enemy = Object.keys(data.users).filter(function(n) {
            return n !== socket.socket.sessionid;
        })[0];

        myEnemyObject = data.users[enemy];

        xVal.text(myObject.x);
        yVal.text(myObject.y);

        xValEnemy.text(myEnemyObject.x || 'waiting');
        yValEnemy.text(myEnemyObject.y || 'waiting');

    });

    $('body').keydown(function(event) {

        event.preventDefault();

        if (status === "waiting") {
            // because you're not allowed to move
            // when there are less than 2 players
            return;
        }

        switch (event.keyCode) {
            case 37:
                --myObject.x;
                break;
            case 38:
                --myObject.y;
                break;
            case 39:
                ++myObject.x;
                break;
            case 40:
                ++myObject.y;
                break;
            default:
                break;
        }

        socket.emit('keypress', {
            x: myObject.x,
            y: myObject.y
        });

    });

});
