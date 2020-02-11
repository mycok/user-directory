function successResponse(res, status, result, type = 'application/json', isJson = true) {
  res.status(status);
  res.set('Content-Type', type);
  return isJson ? res.send(result) : res.json(result);
}

export default successResponse;
