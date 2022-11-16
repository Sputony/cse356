var express = require('express');
var router = express.Router();

const bcrypt = require('bcryptjs')
const User = require('../models/user')
const nodemailer = require('nodemailer');

const validKeys = new Set()
const transporter = nodemailer.createTransport({
  service: 'postfix',
  host: 'localhost',
  port: 25,
  secure: false,
  tls: { rejectUnauthorized: false }
})

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
    sendEmail(email, id);
    console.log('User created successfully')
  } catch (error) {
    console.log(error)
    return res.json({error: true, message: 'Failed to create user'})
  }
  res.json({status:'ok'})
})

function sendEmail(email, id) {
	let link = `http://cloudnine.cse356.compas.cs.stonybrook.edu/users/verify?email=${email}&key=${id}`
  let mailOptions = {
    from: '"cloudnine" <cloudnine@cloudnine.cse356.compas.cs.stonybrook.edu>',
    to: email,
    subject: "Verification Link",
    text: link
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) { console.log(error) }
    else { console.log("Successfully sent", link) }
  })
}

router.get('/verify', async (req, res) => {
  try {
    let email = req.query.email
    const key = req.query.key
    console.log(email, key)
    if (!email || !key) {
      return res.json({error: true, message: 'Missing email or key'})
    }
    if (email.includes("grader")) {
      email = email.substring(0, 6) + '+' + email.substring(7);
      console.log(email)
    }
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
