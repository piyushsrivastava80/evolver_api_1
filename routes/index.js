var express = require('express');
var router = express.Router();

var User = require('./../controllers/User');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', User.login);

module.exports = router;
