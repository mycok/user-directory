export default function (res, err, errResponse, ValidationError = undefined) {
  if (ValidationError && err instanceof ValidationError) {
    return errResponse(res, 400, err.message);
  }
  if (err.message === 'Not Found') {
    return errResponse(res, 404, err.message);
  }
  if (err.message === 'Invalid password') {
    return errResponse(res, 401, err.message);
  }
  return errResponse(res, 500, err.message);
}
