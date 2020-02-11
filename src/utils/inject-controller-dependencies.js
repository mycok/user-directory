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
  ]
) {
  const engine = controllerToEngineMap.get(controller);
  const validator = controllerToValidatorMap.get(controller);
  const requireValidators = [
    'createUser',
    'searchUsers',
  ];

  return (req, res) => {
    if (requireValidators.includes(controller.name)) {
      return controller(
        req, res, db, engine, validator,
        ValidationError, errResponse, successResponse, dbQueryParams,
      );
    }
    return controller(req, res, db, engine, errResponse, successResponse, dbQueryParams);
  };
}

export default injectControllerDependencies;
