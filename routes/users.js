var db = require('../config/db')
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var users = {
 
  getAll: function(req, res) {
    db.getConnection(function(err,connection) {
        var q = connection.query('select * from futbol_app.usuarios');

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
 
  getOne: function(req, res){ 
    db.getConnection(function(err,connection) {
        var id = req.params.username;
        var q = connection.query('select * from futbol_app.usuarios where username=?',[id]);
        q.on('error', function(err) {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Error"
            });
            
        }); 
        q.on('result', function(result) {
            res.json(result);
        });  
        connection.release();
    });
  },
 
  create: function(req, res) {
      db.getConnection(function(err,connection) {
        //var newuser = req.body;
        var q = connection.query
        ('insert into futbol_app.usuarios (username,hashedpassword,nombreUsuario,apellidoUsuario,posicionUsuario,direccionUsuario,rolUsuario,creacionUsuario) values (?,?,?,?,?,?,?,?)',
        [req.body.username,req.body.password,req.body.first_name,req.body.last_name,req.body.posicion,req.body.direccion,req.body.rol,new Date().toLocaleString()]);

        q.on('error', function(err) {
            console.log(err);
            res.status(401);
            res.json({
                "status": 401,
                "message": "Error"
            });
            
        }); 
        
          q.on('result', function(result) {
            res.status(200);
              
              res.send(result);
            
        }); 
          
        connection.release();
      });
  },
 
  update: function(req, res) {
      db.getConnection(function(err,connection) {
        var newuser = req.body;
        //OJO mandar todos los datos otra vez en el form
        var q = connection.query    
        ('update futbol_app.usuarios set username=?,hashedpassword=?,nombreUsuario=?,apellidoUsuario=?,direccionUsuario=?,posicionUsuario=? where userID=?',
        [req.body.userID,req.body.password,req.body.nombre,req.body.apellido,req.body.direccion,req.body.username,req.body.posicion]);
        connection.release();
          
        q.on('error', function(err) {
            res.status(411);
            res.json({
                "status": 411,
                "message": "No se actualizo"
            });
            return;         
        }); 
          
        q.on('result', function(err) {
            res.status(200);
            res.json({
                "status": 200,
                "message": "Actualizado"
            });
            return;     
        }); 
        
          
      });
  },
 
  delete: function(req, res) {
      db.getConnection(function(err,connection) {
        var q = connection.query('delete from futbol_app.usuarios where id=?',[req.params.userID]);

        q.on('error', function(err) {
            res.status(411);
            res.json({
                "status": 411,
                "message": "No se Elimino"
            });
            return;            
        }); 
        res.send(true);
        connection.release();
          
      });
  }
};
 
module.exports = users;