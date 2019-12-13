function errorHandler(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && err.type === 'entity.parse.failed') {
    res.status(err.status).set({ 'Content-Type': 'application/json' }).json({ message: 'Payload should be in JSON format' });
    return;
  }
  next();
}

export default errorHandler;
