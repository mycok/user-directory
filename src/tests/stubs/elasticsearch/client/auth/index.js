import { stub } from 'sinon';

const ES_SEARCH_RESULTS = {
  took: 0,
  timed_out: false,
  _shards: {
    total: 1, successful: 1, skipped: 0, failed: 0,
  },
  hits: {
    total: { value: 1 },
    max_score: 1,
    hits: [{
      _index: 'test',
      _type: 'user',
      _id: 'QrYj82EBkU56P7ZFzPef',
      _score: 1,
      _source: {
        email: 'test@usermail.com',
        password: 'passWord#99',
        profile: {
          name: {
            first: 'first',
            last: 'last',
            middle: 'middle',
          },
          summary: 'Sample Summary 1',
          bio: 'Sample Bio 1',
        },
      },
    },
    ],
  },
};

const ES_NOT_FOUND_SEARCH_RESULTS = {
  took: 0,
  timed_out: false,
  _shards: {
    total: 0, successful: 0, skipped: 0, failed: 0,
  },
  hits: {
    total: { value: 0 },
    max_score: 0,
    hits: [],
  },

};

const GENERIC_ERROR = new Error('Internal server error');

const generateSearchClientStubs = {
  success() {
    return stub().resolves(ES_SEARCH_RESULTS);
  },
  notFound() {
    return stub().resolves(ES_NOT_FOUND_SEARCH_RESULTS);
  },
  genericError() {
    return stub().returns(Promise.reject(GENERIC_ERROR));
  },
};

export {
  generateSearchClientStubs as default,
  ES_SEARCH_RESULTS,
  GENERIC_ERROR,
};
