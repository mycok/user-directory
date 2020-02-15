function successResponse(res, status, result, ...[type = 'application/json', isJson = true]) {
  res.status(status);
  res.set('Content-Type', type);
  return isJson ? res.json(result) : res.send(result);
}

export default successResponse;
