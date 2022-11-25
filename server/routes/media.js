var express = require('express');
var router = express.Router();

const isAuth = require("../isAuth")
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'media')
    },
    filename: (req, file, cb) => {
        //console.log(file)
        cb(null, Date.now() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
})

router.post("/upload", upload.single('file'), (req, res) => {
    if (req.file) {
        //console.log(req.file.filename)
        res.json({mediaid: req.file.filename})
    }
    else {
        res.json({error: true, message: "Missing file attachment"})
    }
})

router.get("/access/:mediaid", isAuth, (req, res) => {
    const mediaid = req.params.mediaid
    const fileExt = mediaid.split('.').pop()
    res.setHeader('Content-Type', 'image/'+fileExt);
    res.sendFile(path.join(__dirname, "../media/"+mediaid))
})

module.exports = router;