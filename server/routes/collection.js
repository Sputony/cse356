var express = require('express');
var router = express.Router();

const isAuth = require("../isAuth")
const Document = require('../models/document')

router.post("/create", isAuth, async (req, res) => {
    try {
        console.log(req.body)
        const { name } = req.body
        if (!name) {
            return res.json({error: true, message: "Missing new document name"})
        }
        const newDoc = new Document({name: name})
        let id = (await newDoc.save())._id.toString();
        console.log("Document created successfully")
        res.json({ id: id })
    } catch(error) {
        console.log(error)
        return res.json({error: true, message: "Failed to create document"})
    }
})

router.post("/delete", isAuth, async (req, res) => {
    try {
        console.log(req.body)
        const { id } = req.body
        if (!id) {
            return res.json({error: true, message: "Missing document id to delete"})
        }
        const doc = await Document.findByIdAndDelete(id)
        console.log("Successfully deleted document:", doc.name)
        return res.json({ status: "ok"})
    } catch (error) {
        console.log(error)
        return res.json({error: true, message: "Failed to delete document"})
    }
})

router.get("/list", isAuth, async (req, res) => {
    try {
        Document.find().sort('-updatedAt').limit(10).exec((err, docs) =>{
          console.log(docs)
          console.log("Successfully retrieved documents")
          return res.json(docs)
        })
      } catch (error) {
        console.log(error)
        res.json({error: true, message: "Failed to retrieve documents"})
      }
})

module.exports = router;