function injectControllerDependencies(
  controller, db, controllerToEngineMap, controllerToValidatorMap, ...otherArguments
) {
  const engine = controllerToEngineMap.get(controller);
  const validator = controllerToValidatorMap.get(controller);
  return (req, res) => {
    controller(req, res, db, engine, validator, ...otherArguments);
  };
}

export default injectControllerDependencies;
