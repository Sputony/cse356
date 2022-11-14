var express = require('express');
var router = express.Router();

const bcrypt = require('bcryptjs')
const User = require('../models/user')
const { exec } = require('child_process');

const validKeys = new Set()

router.post('/signup', async (req, res) => {
  try {
    console.log(req.body)
    const { name, email, password } = req.body
    if (!name || !password || !email) {
      return res.json({error: true, message: 'Missing name, email, or password' });
    }
    let user = await User.findOne({ name });
    if (user) {
      return res.json({error: true, message: 'Name is already registered' });
    }
    user = await User.findOne({ email });
    if (user) {
      return res.json({ error: true, message: 'Email is already registered' });
    }
  
    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = new User({name: name, email: email, passwordHash: passwordHash})
    let id = (await newUser.save())._id.toString();
    validKeys.add(id);
    await sendEmail(email, id);
    console.log('User created successfully')
  } catch (error) {
    console.log(error)
    return res.json({error: true, message: 'Failed to create user'})
  }
  res.json({status:'ok'})
})

async function sendEmail(email, id) {
	let link = `http://cloudnine.cse356.compas.cs.stonybrook.edu/users/verify?email=${email}&key=${id}`
	let command = `echo \"${link}\" | mail -s \"Verification Link\" ${email}`;
  console.log(command)
	await exec(command);
}

router.get('/verify', async (req, res) => {
  try {
    const email = req.query.email
    const key = req.query.key
    if (!email || !key) {
      return res.json({error: true, message: 'Missing email or key'})
    }
    console.log(email, key)
  
    const user = await User.findOne({ email })
    if (!user) {
      return res.json({error: true, message: 'Invalid user'})
    }
    if (!validKeys.has(key)) {
      return res.json({error: true, message: 'Invalid key'});
    }
    user.enabled = true;
    await user.save();
    console.log('User successfully verified')
    res.json({ status: 'Account successfully verified'});
  } catch (error) {
    console.log(error)
    return res.json({error: true, message: 'Failed to verfiy user'})
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!user) {
    return res.json({error: true, message: 'Email is not registered'})
  }
  if (!user.enabled) {
    return res.json({error: true, message: 'Account has not been verified'})
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
