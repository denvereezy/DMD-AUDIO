exports.library = function(req, res, next) {
    res.render('library');
};

exports.playback = function(req, res, next) {
    res.render('playback');
};

exports.home = function(req, res, next) {
    res.render('playback');
};

exports.queue = function(req, res, next) {
    res.render('queue');
};
