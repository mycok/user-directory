function injectControllerDependencies(
  controller,
  db,
  ...[
    controllerToEngineMap,
    controllerToValidatorMap,
    ValidationError,
    errResponse,
    successResponse,
  ]
) {
  const engine = controllerToEngineMap.get(controller);
  const validator = controllerToValidatorMap.get(controller);
  return (req, res) => {
    if (controller.name === 'createUser') {
      return controller(
        req, res, db, engine, validator, ValidationError, errResponse, successResponse,
      );
    }
    return controller(req, res, db, engine, errResponse, successResponse);
  };
}

export default injectControllerDependencies;
