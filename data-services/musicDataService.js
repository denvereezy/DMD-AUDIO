const QueryDataService = require('./queryDataService');

module.exports = function(connection) {
    const queryDataService = new QueryDataService(connection);

    this.add = function(data) {
        return queryDataService.executeQuery('insert into music set ?', data);
    };

    this.show = function() {
        return queryDataService.executeQuery('select * from music');
    };

    this.edit = function (id) {
        return queryDataService.executeQuery(`select * from music where id = ${id}`);
    };

    this.update = function (id, name) {
        return queryDataService.executeQuery('update music set name = ? where id = ?', [name, id]);
    };
};
