var express = require('express');
var router = express.Router();

const bcrypt = require('bcryptjs')
const User = require('../models/user')

router.post('/signup', async (req, res) => {
  try {
    console.log(req.body)
    const { name, email, password } = req.body
    const passwordHash = await bcrypt.hash(password, 10)

    const response = await User.create({
      name, email, passwordHash
    })
    console.log('User created successfully: ', response)
  } catch (error) {
    console.log(error)
    return res.json({status: 'error'})
  }
  res.json({status:'ok'})
})

module.exports = router;
