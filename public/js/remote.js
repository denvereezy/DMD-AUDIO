var io = require('./socket.io');
var socket = io();

socket.on('action', function(data) {
    switch (data.action) {
        case 'play_pause':
            $('#play').click();
            break;
        case 'back':
            $('#previous').click();
            break;
        case 'stop':
            $('#stop').click();
            break;
        case 'next':
            $('#next').click();
            break;
    };
});
socket.on('volume', function(data) {
    console.log(data.volume);
    switch (data.volume) {
        case 'up':
            $('#volume_up').click();
            break;
        case 'down':
            $('#volume_down').click();
            break;
    };
});
