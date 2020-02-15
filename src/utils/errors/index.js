export default function (res, err, errResponse, ValidationError = undefined) {
  if (ValidationError && err instanceof ValidationError) {
    return errResponse(res, 400, err.message);
  }
  return errResponse(res, 500, err.message);
}
