const co = require('co');

exports.add = function(req, res, next) {
    co(function * () {
        try {
            const services = yield req.getServices();
            const musicDataService = services.musicDataService;
            const path = (req.file.path).replace('public/', '');

            const data = {
                song: path,
                name: req.file.originalname.replace('.mp3', '')
            };
            const music = yield musicDataService.add(data);
            res.sendStatus(200);
        } catch (err) {
            next(err);
            console.log(err);
        }
    });
};

exports.songs = function(req, res, next) {
    co(function * () {
        try {
            const services = yield req.getServices();
            const musicDataService = services.musicDataService;
            const music = yield musicDataService.show();
            res.send(music);
        } catch (err) {
            next(err);
            console.log(err);
        }
    });
};

exports.edit = function(req, res, next) {
    co(function * () {
        try {
            const services = yield req.getServices();
            const musicDataService = services.musicDataService;
            var id = req.params.id;
            const music = yield musicDataService.edit(id);
            res.send(music[0]);
        } catch (err) {
            next(err);
            console.log(err);
        }
    });
};

exports.update = function(req, res, next) {
    co(function * () {
        try {
            const services = yield req.getServices();
            const musicDataService = services.musicDataService;
            var name = req.body.name,
                id = req.params.id;
            const music = yield musicDataService.update(id, name);
            res.sendStatus(200);
        } catch (err) {
            next(err);
            console.log(err);
        }
    });
};
