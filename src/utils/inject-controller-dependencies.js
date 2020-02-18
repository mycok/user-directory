function injectControllerDependencies(
  controller,
  db,
  ...[
    controllerToEngineMap,
    controllerToValidatorMap,
    ValidationError,
    errResponse,
    successResponse,
    dbQueryParams,
    generateErrResponses,
    hashPassword,
  ]
) {
  const engine = controllerToEngineMap.get(controller);
  const validator = controllerToValidatorMap.get(controller);
  const requireValidators = ['searchUsers', 'updateProfile', 'replaceProfile'];

  return (req, res) => {
    if (controller.name === 'createUser') {
      return controller(
        req, res, db, engine, validator,
        ValidationError, errResponse, successResponse, dbQueryParams,
        generateErrResponses, hashPassword,
      );
    }
    if (requireValidators.includes(controller.name)) {
      return controller(
        req, res, db, engine, validator,
        ValidationError, errResponse, successResponse, dbQueryParams, generateErrResponses,
      );
    }
    return controller(
      req, res, db, engine,
      errResponse, successResponse, dbQueryParams, generateErrResponses,
    );
  };
}

export default injectControllerDependencies;
