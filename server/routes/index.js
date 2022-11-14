var express = require('express');
var router = express.Router();

const isAuth = require("../isAuth")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/home", isAuth, (req, res) => {
  res.json({status: 'Access granted'})
})

module.exports = router;
