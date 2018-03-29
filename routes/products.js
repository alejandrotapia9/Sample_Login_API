var db = require('../config/db');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var products = {
 
  getAll: function(req, res) {    
    db.getConnection(function(err,connection) {
        var q = connection.query('select * from coffee_society.productos');
        var all=new Array;          
          
        q.on('result', function(row) {
            all.push(row);            
        });
          
        q.on('end', function() {
            res.json(all);            
        });
        
        connection.release();
    }); 
  },
 
  getOne: function(req, res) {
      db.getConnection(function(err,connection) {
        var id = req.params.id;
        var q = connection.query('select * from coffee_society.productos where productoID=?',[id]);

        q.on('result', function(result) {
            res.json(result);
        });
          
        connection.release();
      });
  },
   
};
 
module.exports = products;