var db = require('../config/db')
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
var express = require('express');
var app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));



var ordenes = {
  getAll: function(req, res) {
      
    var user = getUser(req);
      
    db.getConnection(function(err,connection) {
        
        if(user.rolUsuario=="admin"){
            var q = connection.query('SELECT O.numeroOrden as Orden, O.fechaOrden as Fecha, P.nombreProducto as Producto, C.cantidad as Cantidad, O.estado_orden as Estado FROM ordenes O JOIN cafes_en_orden C ON O.ordenID = C.ordenID  JOIN productos P ON P.productoID = C.productoID ORDER by O.fechaOrden desc');
        }else if(user.rolUsuario=="usuario"){
            var q = connection.query
            ('SELECT O.numeroOrden as Orden, O.fechaOrden as Fecha, P.nombreProducto as Producto, C.cantidad as Cantidad, O.estado_orden as Estado FROM ordenes O JOIN cafes_en_orden C ON O.ordenID = C.ordenID  JOIN productos P ON P.productoID = C.productoID where O.usuarioID = ? ORDER by O.fechaOrden desc',[user.id]);
        }   
                     
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
    
  getAllPendientes: function(req, res) {
      
    var user = getUser(req);
      
    db.getConnection(function(err,connection) {
        
        if(user.rolUsuario=="admin"){
            var q = connection.query("SELECT O.numeroOrden as Orden, O.fechaOrden as Fecha, P.nombreProducto as Producto, C.cantidad as Cantidad, O.estado_orden as Estado FROM ordenes O JOIN cafes_en_orden C ON O.ordenID = C.ordenID  JOIN productos P ON P.productoID = C.productoID where O.estado_orden = 'Pendiente' ORDER by O.fechaOrden desc");
        }else if(user.rolUsuario=="usuario"){
            var q = connection.query
            ("SELECT O.numeroOrden as Orden, O.fechaOrden as Fecha, P.nombreProducto as Producto, C.cantidad as Cantidad, O.estado_orden as Estado FROM ordenes O JOIN cafes_en_orden C ON O.ordenID = C.ordenID  JOIN productos P ON P.productoID = C.productoID where O.usuarioID = 'Pendiente' and O.estado_orden = ? ORDER by O.fechaOrden desc",[user.id]);
        }   
                     
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
      
    var user = getUser(req);
    db.getConnection(function(err,connection) {
        var id = req.params.ordenID;
        var q = connection.query
            ('SELECT O.numeroOrden as Orden, O.fechaOrden as Fecha, P.nombreProducto as Producto, C.cantidad as Cantidad, O.estado_orden as Estado FROM ordenes O JOIN cafes_en_orden C ON O.ordenID = C.ordenID  JOIN productos P ON P.productoID = C.productoID where O.ordenID = ? ORDER by O.fechaOrden desc',[id]);

        q.on('result', function(result) {
            res.json(result);
        });  
        connection.release();
    });
  },
 
  create: function(req, res) {
         
      db.getConnection(function(err,connection) {
        
                  
        var q2 = connection.query        
        ("insert into coffee_society.ordenes (numeroOrden,usuarioID,fechaOrden,estado_orden,productoID,cantidad,totalOrden) values (?,?,now(),'Pendiente',?,?,(select (productos.precioProducto * ?) FROM productos where coffee_society.productos.productoID = ?))",
        [req.body.numeroOrden || 0 ,req.body.usuarioID,req.body.productoID,req.body.cantidad,req.body.cantidad,req.body.productoID]);
        
        q2.on('error', function(err) {
            if(err){
                res.send(false);
            }            
        }); 
        res.send(true);
        connection.release();
      });
  },
 
  update: function(req, res) {
      
      db.getConnection(function(err,connection) {
        var newuser = req.body;
        //OJO mandar todos los datos otra vez en el form
        var q = connection.query    
        ('update coffee_society.usuarios set username=?,password=?,first_name=?,last_name=?,tipo=? where id=?',
        [req.body.username,req.body.password,req.body.first_name,req.body.last_name,2,req.params.id]);

        q.on('error', function(err) {
            if(err){
                throw err;
            }            
        }); 
        res.send(true);
          connection.release();
      });
  },
 
  delete: function(req, res) {
    
      db.getConnection(function(err,connection) {
        var q = connection.query('delete from coffee_society.usuarios where id=?',[req.params.id]);

        q.on('error', function(err) {
            if(err){
                throw err;
            }            
        }); 
        res.send(true);
        connection.release();
          
      });
  }
};

function getUser(req){
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || (req.headers['x-access-token']);
    var decoded = jwt.decode(token, require('../config/secret.js')());
    return decoded.user;
 };
module.exports = ordenes;