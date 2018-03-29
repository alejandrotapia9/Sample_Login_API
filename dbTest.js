var sql = require('mysql'); 
var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var connection = sql.createConnection({
  host: "localhost",
  port:	3306,
  user: "user",
  password: "user",
  database:'futbol_app'
});



app.listen(3000, function () {
    
    connection.connect(function(err) {
    	if (err) throw err;
  	else
        console.log("Connected!"); 
    }); 

  console.log('Example app listening on port 3000!')
})

app.post('/login', function (req, res) {
    
    var username = req.body.username || '';
    var password = req.body.password || '';
    
    
    if (username == '' || password == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });     
    } 
    

    
    validate(username,password,function(err,result){ 
            var dbUserObj=result;
        
        console.log(dbUserObj); });
    
    
})
// Connection string parameters.

function validate(username,password,callback){
              
    var q = connection.query('select first_name,username,password,tipo from coffee_society.usuarios where username=? and password=?',[username,password]);
    
    q.on('result', function(row) {
        callback(null,row);
    });
    
            
}
