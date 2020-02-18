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
import updateProfile from '../../controllers/profile/update';
import replace from '../../engines/profile/replace';
import replaceProfile from '../../controllers/profile/replace';

import fetchById from '../../middleware/user-by-id';

import injectControllerDependencies from '../../utils/inject-controller-dependencies';
import errResponse from '../../utils/errResponse';
import successResponse from '../../utils/successResponse';
import generateErrResponses from '../../utils/errors';
import hashPassword from '../../utils/hashPassword';

const controllerToEngineMap = new Map([
  [createUser, create],
  [retrieveUser, retrieve],
  [deleteUser, del],
  [searchUsers, search],
  [updateProfile, update],
  [replaceProfile, replace],
]);

const controllerToValidatorMap = new Map([
  [createUser, createValidator],
  [searchUsers, searchValidator],
  [updateProfile, updateValidator],
  [replaceProfile, updateValidator],
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
    hashPassword,
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
    hashPassword,
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
    hashPassword,
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
    hashPassword,
  ));

router.route('/users/:userId/profile')
  .patch(injectControllerDependencies(
    updateProfile,
    db,
    controllerToEngineMap,
    controllerToValidatorMap,
    ValidationError,
    errResponse,
    successResponse,
    dbQueryParams,
    generateErrResponses,
    hashPassword,
  ))
  .put(injectControllerDependencies(
    replaceProfile,
    db,
    controllerToEngineMap,
    controllerToValidatorMap,
    ValidationError,
    errResponse,
    successResponse,
    dbQueryParams,
    generateErrResponses,
    hashPassword,
  ));

export default router;
