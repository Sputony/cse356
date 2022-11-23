var express = require('express');
var router = express.Router();

const isAuth = require("../isAuth")
const Document = require('../models/document')

/* GET home page. */
router.get('/', function(req, res, next) {
  const filename = '/root/collab-doc/server/public/index.html'
  res.sendFile(filename)
  //res.render('index', { title: 'Express' });
});

router.get("/home", (req, res) => {
  const filename = '/root/collab-doc/server/public/home.html'
  res.sendFile(filename)
})

router.get("/edit/:id", (req, res) => {
  const filename = '/root/collab-doc/server/public/quill.html'
  res.sendFile(filename)
})

module.exports = router;
