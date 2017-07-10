const QueryDataService = require('./queryDataService');

module.exports = function(connection) {
    const queryDataService = new QueryDataService(connection);

    this.add = function(data) {
        return queryDataService.executeQuery('insert into music set ?', data);
    };

    this.show = function() {
        return queryDataService.executeQuery('select * from music');
    };
};
