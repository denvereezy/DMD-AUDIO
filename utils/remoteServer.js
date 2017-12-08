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
            stop        : new five.Button('P1-11'),
            random      : new five.Button('P1-29'),
            repeat      : new five.Button('P1-37')
        };

        const volume = {
            up      : new five.Button('P1-13'),
            down    : new five.Button('P1-15'),
            mute    : new five.Button('P1-16')
        };

        action.play_pause.on('down', () => {
            socket.emit('action', {
                action: 'play_pause'
            })
        });

        action.next.on('down', () => {
            socket.emit('action', {
                action: 'next'
            })
        });

        action.back.on('down', () => {
            socket.emit('action', {
                action: 'back'
            })
        });

        action.stop.on('down', () => {
            socket.emit('action', {
                action: 'stop'
            })
        });

        action.random.on('dowm', () => {
            socket.emit('action', {
                action: 'random'
            })
        });

        action.repeat.on('down', () => {
            socket.emit('action', {
                action: 'repeat'
            })
        });

        volume.up.on('down', () => {
            socket.emit('volume', {
                volume: 'up'
            })
        });

        volume.down.on('down', () => {
            socket.emit('volume', {
                volume: 'down'
            })
        });

        volume.mute.on('down', () => {
            socket.emit('volume', {
                volume: 'mute'
            })
        });
    });
};
