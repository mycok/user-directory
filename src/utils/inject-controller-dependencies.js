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
  ]
) {
  const engine = controllerToEngineMap.get(controller);
  const validator = controllerToValidatorMap.get(controller);
  const requireValidators = [
    'createUser',
    'searchUsers',
    'updateUser',
  ];

  return (req, res) => {
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
