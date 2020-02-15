import { stub } from 'sinon';

const updatedUserObject = {
  result: 'updated',
};
const GENERIC_ERROR = new Error('Internal server error');

const generateUpdateClientStubs = {
  success: () => stub().resolves(updatedUserObject),
  genericError: () => stub().returns(Promise.reject(GENERIC_ERROR)),
};

export {
  generateUpdateClientStubs as default,
  updatedUserObject,
  GENERIC_ERROR,
};
