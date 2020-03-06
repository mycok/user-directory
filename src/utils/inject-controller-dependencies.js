function injectControllerDependencies(controller, db,
  ...[controllerToEngineMap, controllerToValidatorMap, ValidationError, errResponse,
    successResponse, dbQueryParams, generateErrResponses, hashPassword, compareSync, sign]) {
  const engine = controllerToEngineMap.get(controller);
  const validator = controllerToValidatorMap.get(controller);

  return (req, res) => {
    let response;
    switch (controller.name) {
      case 'searchUsers': case 'updateProfile': case 'replaceProfile':
        response = controller(
          req, res, db, engine, validator,
          ValidationError, errResponse, successResponse, dbQueryParams, generateErrResponses,
        );
        break;
      case 'createUser':
        response = controller(
          req, res, db, engine, validator,
          ValidationError, errResponse, successResponse, dbQueryParams,
          generateErrResponses, hashPassword,
        );
        break;
      case 'userLogin':
        response = controller(
          req, res, db, engine, validator,
          ValidationError, errResponse, successResponse, dbQueryParams,
          generateErrResponses, compareSync, sign,
        );
        break;
      default:
        response = controller(
          req, res, db, engine,
          errResponse, successResponse, dbQueryParams, generateErrResponses,
        );
    }
    return response;
  };
}

export default injectControllerDependencies;
