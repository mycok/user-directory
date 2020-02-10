function successResponse(res, status, result, type = 'application/json') {
  res.status(status);
  res.set('Content-Type', type);
  return res.send(result);
}

export default successResponse;
