function logger(req, res, next) {
  console.log(`${req.method} ${req.url} ${new Date().toLocaleTimeString()}`);
  next();
}

module.exports = logger;
