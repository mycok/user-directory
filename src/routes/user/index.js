import { Router } from 'express';

import db from '../../database/elasticsearch-setup';
import ValidationError from '../../errors/validation-error';
import create from '../../engines/user';
import createUser from '../../controllers/user/create';
import validate from '../../validators/user/create/validate';

import checkForEmptyPayload from '../../middleware/check-empty-payload';
import checkIfContentTypeIsSet from '../../middleware/check-content-type';
import checkIfContentTypeIsJson from '../../middleware/check-content-type-is-json';

import injectControllerDependencies from '../../utils/inject-controller-dependencies';

const controllerToEngineMap = new Map([
  [createUser, create],
]);

const controllerToValidatorMap = new Map([
  [createUser, validate],
]);

const router = Router();

router.route('/users')
  .post(
    checkForEmptyPayload,
    checkIfContentTypeIsSet,
    checkIfContentTypeIsJson,
    injectControllerDependencies(
      createUser,
      db,
      controllerToEngineMap,
      controllerToValidatorMap,
      ValidationError,
    ),
  );

export default router;
