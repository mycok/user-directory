import { Router } from 'express';

import db from '../../database/elasticsearch-setup';
import ValidationError from '../../errors/validation-error';
import createValidator from '../../validators/user/create/validate';
import searchValidator from '../../validators/user/search/validate';

import create from '../../engines/user/create';
import createUser from '../../controllers/user/create';
import retrieve from '../../engines/user/retrieve';
import retrieveUser from '../../controllers/user/retrieve';
import del from '../../engines/user/delete';
import deleteUser from '../../controllers/user/delete';
import search from '../../engines/user/search';
import searchUsers from '../../controllers/user/search';

import checkForEmptyPayload from '../../middleware/check-empty-payload';
import checkIfContentTypeIsSet from '../../middleware/check-content-type';
import checkIfContentTypeIsJson from '../../middleware/check-content-type-is-json';

import injectControllerDependencies from '../../utils/inject-controller-dependencies';
import errResponse from '../../utils/errResponse';
import successResponse from '../../utils/successResponse';
import dbQueryParams from '../../database/dbQueryParams';

const controllerToEngineMap = new Map([
  [createUser, create],
  [retrieveUser, retrieve],
  [deleteUser, del],
  [searchUsers, search],
]);

const controllerToValidatorMap = new Map([
  [createUser, createValidator],
  [searchUsers, searchValidator],
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
      errResponse,
      successResponse,
      dbQueryParams,
    ),
  )
  .get(injectControllerDependencies(
    searchUsers,
    db,
    controllerToEngineMap,
    controllerToValidatorMap,
    ValidationError,
    errResponse,
    successResponse,
    dbQueryParams,
  ));

router.route('/users/:userId')
  .get(injectControllerDependencies(
    retrieveUser,
    db,
    controllerToEngineMap,
    controllerToValidatorMap,
    ValidationError,
    errResponse,
    successResponse,
    dbQueryParams,
  ))
  .delete(injectControllerDependencies(
    deleteUser,
    db,
    controllerToEngineMap,
    controllerToValidatorMap,
    ValidationError,
    errResponse,
    successResponse,
    dbQueryParams,
  ));

export default router;
