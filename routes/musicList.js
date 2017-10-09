const Promise = require('bluebird');

exports.linkMultipleSongs = function(req, results) {
    var selectedSongs = results;
    return new Promise(function(resolve, reject) {
        resolve(selectedSongs);
    }).mapSeries(function(result) {
        req.getServices().then(function(services) {
            var musicDataService = services.musicDataService;
            var data = {
                song: result.path.replace('public/', ''),
                name: result.originalname.replace('.mp3', '')
            };
            return musicDataService.add(data);
        })
    })
};
