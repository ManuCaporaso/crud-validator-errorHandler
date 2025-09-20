function errorHandler(err, req, res, next) {
  console.error(err.stack); // Log en consola para debug

  // Si el error tiene código de estado, usarlo; sino, 500
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: true,
    message: err.message || 'Internal Server Error',
  });
}

module.exports = errorHandler;