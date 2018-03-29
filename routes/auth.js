var jwt = require('jwt-simple');
var pool = require('../config/db');
var sql = require('mysql');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

var auth = {

    login: function (req, res) {

        var username = req.body.username || '';
        var password = req.body.password || '';

        //console.log(username+password);        
        if (username == '' || password == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "No Credentials"
            });
            return;
        }

        // Fire a query to your DB and check if the credentials are valid
        auth.validate(username, password, function (err, result) {

            var dbUserObj = result;

            if (!dbUserObj) { // If authentication fails, we send a 401 back
                res.status(411);
                res.json({
                    "status": 411,
                    "message": "Invalid credentials"
                });

                return;
            }

            if (dbUserObj) {

                // If authentication is success, we will generate a token
                // and dispatch it to the client
                res.status(200);
                res.json(genToken(dbUserObj));

                return;
            }
        });
    },

    validate: function (username, password, callback) {

        pool.getConnection(function (err, connection) {

            var q = connection.query('select username,rolUsuario from futbol_app.usuarios where username=? and hashedpassword=?', [username, password], function (error, result) {
                
                if(err)
                    callback(err,null);
                else if(result.length > 0) 
                    callback(null, result);
                else 
                    callback(null, null);

            });

            connection.release();

        });
    },

    validateUser: function (username, callback) {

        pool.getConnection(function (err, connection) {

            connection.query('select username,rolUsuario from futbol_app.usuarios where username=?', [username], function (error, result) {

                if (result.length > 0) callback(null, result);
                else callback(null, null);

            });

            connection.release();

        });
    },
}

// private method
function genToken(dbuser) {
    var expires = expiresIn(60); // 60 days
    var token = jwt.encode({
        exp: expires,
        user: dbuser
    }, require('../config/secret')());

    return {
        token: token,
        expires: expires,
        user:dbuser
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;