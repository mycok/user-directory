import { Router } from 'express';

import db from '../../database/elasticsearch-setup';
import dbQueryParams from '../../database/dbQueryParams';

import ValidationError from '../../errors/validation-error';

import createValidator from '../../validators/user/create/validate';
import searchValidator from '../../validators/user/search/validate';
import updateValidator from '../../validators/profile/validate';

import create from '../../engines/user/create';
import createUser from '../../controllers/user/create';
import retrieve from '../../engines/user/retrieve';
import retrieveUser from '../../controllers/user/retrieve';
import del from '../../engines/user/delete';
import deleteUser from '../../controllers/user/delete';
import search from '../../engines/user/search';
import searchUsers from '../../controllers/user/search';
import update from '../../engines/profile/update';
import updateUser from '../../controllers/profile/update';

import fetchById from '../../middleware/user-by-id';

import injectControllerDependencies from '../../utils/inject-controller-dependencies';
import errResponse from '../../utils/errResponse';
import successResponse from '../../utils/successResponse';
import generateErrResponses from '../../utils/errors';

const controllerToEngineMap = new Map([
  [createUser, create],
  [retrieveUser, retrieve],
  [deleteUser, del],
  [searchUsers, search],
  [updateUser, update],
]);

const controllerToValidatorMap = new Map([
  [createUser, createValidator],
  [searchUsers, searchValidator],
  [updateUser, updateValidator],
]);

const router = Router();

router.param('userId', fetchById);

router.route('/users')
  .post(injectControllerDependencies(
    createUser,
    db,
    controllerToEngineMap,
    controllerToValidatorMap,
    ValidationError,
    errResponse,
    successResponse,
    dbQueryParams,
    generateErrResponses,
  ))
  .get(injectControllerDependencies(
    searchUsers,
    db,
    controllerToEngineMap,
    controllerToValidatorMap,
    ValidationError,
    errResponse,
    successResponse,
    dbQueryParams,
    generateErrResponses,
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
    generateErrResponses,
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
    generateErrResponses,
  ));

router.route('/users/:userId/profile')
  .patch(injectControllerDependencies(
    updateUser,
    db,
    controllerToEngineMap,
    controllerToValidatorMap,
    ValidationError,
    errResponse,
    successResponse,
    dbQueryParams,
    generateErrResponses,
  ));

export default router;
