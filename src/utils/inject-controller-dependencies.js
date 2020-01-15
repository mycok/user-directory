function injectControllerDependencies(
  controller, db, controllerToEngineMap, controllerToValidatorMap, ValidationError,
) {
  const engine = controllerToEngineMap.get(controller);
  const validator = controllerToValidatorMap.get(controller);
  return (req, res) => {
    controller(req, res, db, engine, validator, ValidationError);
  };
}

export default injectControllerDependencies;
