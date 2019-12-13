import { Router } from 'express';

import checkForEmptyPayload from '../../middleware/check-for-empty-payload';
import checkIfContentTypeIsSet from '../../middleware/check-content-type-is-set';
import checkIfContentTypeIsJson from '../../middleware/check-content-type-is-json';
import checkForRequiredFields from '../../validators/user/create/check-for-required-fields';
import checkRequiredFieldsTypes from '../../validators/user/create/check-required-fields-types';
import validateEmailAddress from '../../validators/user/email-validation';
import validatePassword from '../../validators/user/password-validation';

import createUser from '../../controllers/user/createUser';
import injectHandlerDependencies from '../../utils/inject-handler-dependencies';

import db from '../../database/elasticsearch-setup';

const router = Router();

router.route('/users')
  .post(
    checkForEmptyPayload,
    checkIfContentTypeIsSet,
    checkIfContentTypeIsJson,
    checkForRequiredFields,
    checkRequiredFieldsTypes,
    validateEmailAddress,
    validatePassword,
    injectHandlerDependencies(createUser, db),
  );

export default router;
