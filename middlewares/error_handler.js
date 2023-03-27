function errorHandler(err, req, res, next) {
  return res.send(err.message); // err.message => why not showing the error message from the error that I threw?
}

module.exports = errorHandler;
