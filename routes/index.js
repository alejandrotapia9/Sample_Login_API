var express = require('express');
var router = express.Router();
 
var auth = require('./auth.js');
var products = require('./products.js');
var user = require('./users.js');
var ordenes = require('./ordenes.js');
 
/*
 * Routes that can be accessed by any one
 */
router.post('/login', auth.login);
router.post('/register', user.create);
/*
 * Routes that can be accessed only by autheticated users
 
router.get('/api/v1/products', products.getAll);
router.get('/api/v1/product/:id', products.getOne);

router.get('/api/v1/ordenes', ordenes.getAll);
router.get('/api/v1/orden/:id', ordenes.getOne);
router.delete('/api/v1/orden/:id', ordenes.delete);

router.put('/api/v1/user', user.update);
*/

/*
 * Routes that can be accessed only by authenticated & authorized users
 */

router.get('/api/v1/admin/users', user.getAll);
router.get('/api/v1/admin/user/:id', user.getOne);
router.put('/api/v1/admin/user/:id', user.update);
router.delete('/api/v1/admin/user/:id', user.delete);
 
module.exports = router;