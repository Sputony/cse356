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
    return res.json({error: true, message: 'Failed to create user'})
  }
  res.json({status:'ok'})
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!user) {
    return res.json({error: true, message: 'Email is not registered'})
  }

  if (await bcrypt.compare(password, user.passwordHash)) {
    req.session.isAuth = true
    return res.json({name: user.name})
  }
  return res.json({error: true, message: 'Invalid email/password'})
})

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect('/')
  })
})

module.exports = router;
