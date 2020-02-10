function errResponse(res, status, errMessage) {
  res.status(status);
  res.set('Content-Type', 'application/json');
  return res.json({ message: errMessage });
}

export default errResponse;
