const five  = require('johnny-five'),
      Raspi = require('raspi-io'),
      board = new five.Board({ io: new Raspi() });

exports.control = function(socket) {
    board.on('ready', () => {
        console.log('controls ready');

        const action = {
            play_pause  : new five.Button('P1-7'),
            next        : new five.Button('P1-8'),
            back        : new five.Button('P1-10'),
            stop        : new five.Button('P1-11')
        };

        const volume = {
            up      : new five.Button('P1-13'),
            down    : new five.Button('P1-15')
        };

        action.play_pause.on("down", function() {
            socket.emit('action', {
                action: 'play_pause'
            })
        });

        action.next.on("down", function() {
            socket.emit('action', {
                action: 'next'
            })
        });

        action.back.on("down", function() {
            socket.emit('action', {
                action: 'back'
            })
        });

        action.stop.on("down", function() {
            socket.emit('action', {
                action: 'stop'
            })
        });

        volume.up.on("down", function() {
            socket.emit('volume', {
                volume: 'up'
            })
        });

        volume.down.on("down", function() {
            socket.emit('volume', {
                volume: 'down'
            })
        });
    });
};
