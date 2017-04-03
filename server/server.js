/**
 * Created by Mingholy on 2017/3/27.
 */
'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server({
    connections: {
        routes: {
            cors: true
        }
    }
});

/**
 * Query tasks
 * @type {{getBoroughs: string, getDateRange: string, queryBody: string, getTopTwenty: string, dateFilter: string, boroughFilter: string, boroughFilterWithNull: string}}
 */
const task = {
    getBoroughs: 'SELECT BOROUGH FROM nypd_motor_vehicle_collisions GROUP BY BOROUGH',
    getDateRange: 'SELECT MAX(DATE), MIN(DATE) FROM nypd_motor_vehicle_collisions',
    queryBody: 'SELECT * FROM nypd_motor_vehicle_collisions ',
    // Query conditions
    getTopTwenty: 'ORDER BY DATE LIMIT 50',
    dateFilter: '(DATE BETWEEN ? AND ?)',
    boroughFilter: '(BOROUGH IN (?))',
    boroughFilterWithNull: '(BOROUGH IS NULL OR BOROUGH IN (?))',
};


/**
 * Prepare server on localhost listening port 3100.
 */
server.connection({
    port: 4000,
    host: 'localhost'
});

/**
 * MySQL connection.
 */
server.register({
    register: require('hapi-plugin-mysql'),
    options: {
        host: "127.0.0.1",
        user: "root",
        password: "root",
        database: "nypd",
        port: "3306"
    }
}, function (err) {
    if (err) console.log(err);
});

server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }

    /**
     * For test
     */
    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply.file('./index.html');
        }
    });

    /**
     * For borough filter option list
     */
    server.route({
        method: 'GET',
        path: '/getBoroughs',
        handler: function (request, reply) {
            request.app.db.query(task.getBoroughs, function(err, result) {
                reply(result);
            })
        }
    });

    /**
     * For date filter date range
     */
    server.route({
        method: 'GET',
        path: '/getDateRange',
        handler: function (request, reply) {
            request.app.db.query(task.getDateRange, function(err, result) {
              reply(result);
            })
        }
    });

    server.route({
        method: 'GET',
        path: '/boroughFilter',
        handler: function (request, reply) {
            let params = request.query.boroughs.split(',');
            if (params.includes('unknown')){
                request.app.db.query(task.boroughFilterWithNull, params, function(err, result) {
                    err ? reply(err) : reply(result);
                })
            } else {
                request.app.db.query(task.boroughFilter, params, function(err, result) {
                    err ? reply(err) : reply(result);
                })
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/queryData',
        handler: function (request, reply) {
            let params = request.query,
                currentDate = new Date(),
                queryString = task.queryBody + 'WHERE ' + task.dateFilter;
            //Construct default query params
            params.startDate = params.startDate || '1970-1-1';
            params.dueDate = currentDate.toLocaleDateString();

            if (params.boroughSelected) {
                let boroughParams = params.boroughSelected.split(',');
                console.log(boroughParams);
                if (boroughParams.includes('unknown')) {
                    queryString += ' AND ' + task.boroughFilterWithNull;
                } else {
                    queryString += ' AND ' + task.boroughFilter;
                }
                console.log(queryString);
                console.log(params);
                console.log(boroughParams);
                request.app.db.query(queryString, [params.startDate, params.dueDate, boroughParams], function(err, result) {
                    reply(result);
                });
            } else {
                console.log(queryString);
                console.log(params);
                request.app.db.query(queryString, [params.startDate, params.dueDate], function(err, result) {
                    reply(result);
                });
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/static/css/{filename}',
        handler: {
            directory: {
                path: 'static/css'
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/static/js/{filename}',
        handler: {
            directory: {
                path: 'static/js'
            }
        }
    });
});

 /**
     * Start server.
     */
    server.start((err) => {
        if(err) {
            throw err;
        }
        console.log('Server running at: $(server.info.url}');
    });
