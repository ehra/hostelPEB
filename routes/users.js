module.exports = function(io){
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/users', function(req, res, next) {
  res.render('users');
});

return router;
}