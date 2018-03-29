var sql = require('mysql'); 

// Connection string parameters.
var pool = sql.createPool({
    host: "localhost",
    port:	3306,
    user: "user",
    password: "user",
    database:'futbol_app',
    connectionLimit: 50,
    queueLimit:0 
});

module.exports = pool;