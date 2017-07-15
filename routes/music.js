const co = require('co');

exports.add = function(req, res, next) {
    co(function * () {
        try {
            const services = yield req.getServices();
            const musicDataService = services.musicDataService;
            const path = (req.file.path).replace('public/', '');

            const data = {
                song: path,
                name: req.file.originalname
            };
            const music = yield musicDataService.add(data);

            res.redirect('/library');

        } catch (err) {
            next(err);
            res.redirect('/library');
        };
    });
};

exports.songs = function(req, res, next) {
    co(function * () {
        try {
            const services = yield req.getServices();
            const musicDataService = services.musicDataService;
            const music = yield musicDataService.show();
            res.json(music);
        } catch (err) {
            next(err);
            res.redirect('/playback');
        };
    });
};
