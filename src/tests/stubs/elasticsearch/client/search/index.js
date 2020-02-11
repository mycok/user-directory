import { stub } from 'sinon';

const ES_SEARCH_RESULTS = {
  took: 0,
  timed_out: false,
  _shards: {
    total: 5, successful: 5, skipped: 0, failed: 0,
  },
  hits: {
    total: 2,
    max_score: 1,
    hits: [{
      _index: 'test',
      _type: 'user',
      _id: 'QrYj82EBkU56P7ZFzPef',
      _score: 1,
      _source: {
        email: 'e@ma.il',
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
    }, {
      _index: 'test',
      _type: 'user',
      _id: 'QrYj82EBkU56P7ZFzPef',
      _score: 0.9,
      _source: {
        email: 'foo@bar.baz',
        profile: {
          summary: 'Sample Summary 2',
          bio: 'Sample Bio 2',
        },
      },
    },
    ],
  },
};

const GENERIC_ERROR = new Error('Internal server error');

const generateSearchClientStubs = {
  success() {
    return stub().resolves(ES_SEARCH_RESULTS);
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
