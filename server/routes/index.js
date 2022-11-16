var express = require('express');
var router = express.Router();

const isAuth = require("../isAuth")
const Document = require('../models/document')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/home", (req, res) => {
  getHTML()
  res.json({__html: html})
})

async function getHTML() {
  try {
    Document.find().sort('-updatedAt').limit(10).exec((err, docs) =>{
      // TO DO
      console.log(docs)
    })
  } catch (error) {
    console.log(error)
    res.json({error: true, message: "Failed to retrieve documents"})
  }
}

let html = `
  <div className="CollectionCreate">
    Welcome to collab-doc<br></br>
    <iframe name="createframe" id="createframe" style="display: none;"></iframe>
    <form action="http://cloudnine.cse356.compas.cs.stonybrook.edu/collection/create" method="post" target="createframe">
      New Document Name: <input type="text" name="name"/><br></br>
      <button type="submit">Create Document</button>
    </form>
  </div>`

module.exports = router;
