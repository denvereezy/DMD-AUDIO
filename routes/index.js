const mysql = require('mysql'),
    Promise = require('bluebird');

function MySQLConnection(parameters, cb) {
    const pool = mysql.createPool(parameters);
    var poolConnection;

    this.createConnection = function() {
        return new Promise(function(resolve, reject) {
            pool.getConnection(function(err, connection) {
                if (err)
                    return resolve(err);
                poolConnection = connection;
                resolve(cb(poolConnection));
            });
        });
    };

    this.releaseConnection = function() {
        if (poolConnection) {
            poolConnection.destroy();
        };
    };
};

module.exports = function(dbParams, servicesSetup) {

    if (!dbParams)
        throw Error('Database parameters not supplied');
    if (!servicesSetup)
        throw Error('Service setup callback not supplied');

    var databaseConnection;

    var setupProvider = function(req, res, next) {

        databaseConnection = new MySQLConnection(dbParams, servicesSetup);

        req.getServices = databaseConnection.createConnection;

        var end = res.end;
        res.end = function(data, encoding) {
            try {
                databaseConnection.releaseConnection();
            } catch (err) {
                console.log(err.stack);
            }

            res.end = end;
            res.end(data, encoding);
        };

        next();
    }

    return setupProvider;
};
