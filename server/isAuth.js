module.exports = (req, res, next) => {
    if (req.session.isAuth) {
      next();
    } else {
      res.json({error: true, message: 'Invalid session'})
    }
};