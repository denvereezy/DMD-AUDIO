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
        case 'random':
            $('#random').click();
            break;
        case 'repeat':
            $('#repeat').click();
            break;
        case 'single':
            $('#single').click();
            break;
    };
});

socket.on('volume', function(data) {
    switch (data.volume) {
        case 'up':
            $('#volume_up').click();
            break;
        case 'down':
            $('#volume_down').click();
            break;
        case 'mute':
            $('#volume_off').click();
            break;
    };
});

socket.on('view', function(data) {
    switch (data.view) {
        case 'library':
            $('#library a').click();
            break;
        case 'playback':
            $('#playback a').click();
            break;
        case 'queue':
            $('#queue a').click();
    }
})
