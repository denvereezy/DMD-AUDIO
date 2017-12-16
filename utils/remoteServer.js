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
            random      : new five.Button('P1-12'),
            repeat      : new five.Button('P1-13'),
            single      : new five.Button('P1-15')
        };

        const volume = {
            up      : new five.Button('P1-16'),
            down    : new five.Button('P1-18'),
            mute    : new five.Button('P1-19')
        };

        const controls = {
            library  : new five.Button('P1-21'),
            playback : new five.Button('P1-22')
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

        action.single.on('down', () => {
            socket.emit('action', {
                action: 'single'
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

        controls.library.on('down', () => {
            socket.emit('view', {
                view: 'library'
            })
        });
    });
};
