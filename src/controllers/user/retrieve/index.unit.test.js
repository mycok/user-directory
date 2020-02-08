import assert from 'assert';

import generateResSpy from '../../../tests/spies/res';
import generateRetrieveEngineStubs,
{ RESOLVED_USER_OBJ, NOT_FOUND_ERROR, GENERIC_ERROR }
  from '../../../tests/stubs/engines/user/retrieve';
import retrieveUser from '.';

describe('retrieveUser controller functionality', function () {
  const req = {};
  const db = {};

  let res;
  let engine;

  beforeEach(function () {
    res = generateResSpy();
  });

  describe('when invoked', function () {
    beforeEach(function () {
      engine = generateRetrieveEngineStubs().success;
      return retrieveUser(req, res, db, engine);
    });

    describe('should call the retrieve engine function', function () {
      it('once', function () {
        assert(engine.calledOnce);
      });

      it('with req, and db as arguments', function () {
        assert(engine.calledWithExactly(req, db));
      });
    });
  });
  describe('when invoked with a valid request object', function () {
    beforeEach(function () {
      engine = generateRetrieveEngineStubs().success;
      return retrieveUser(req, res, db, engine);
    });

    describe('should call res.status()', function () {
      it('once', function () {
        assert(res.status.calledOnce);
      });
      it('with a 200 status code', function () {
        assert(res.status.calledWithExactly(200));
      });
    });

    describe('call res.set()', function () {
      it('once', function () {
        assert(res.set.calledOnce);
      });

      it('with "Content-Type" and "application/json" arguments', function () {
        assert(res.set.calledWithExactly('Content-Type', 'application/json'));
      });
    });

    describe('call res.send()', function () {
      it('once', function () {
        assert(res.send.calledOnce);
      });

      it('should resolve with a user object', function () {
        assert(res.send.calledWithExactly(RESOLVED_USER_OBJ));
      });
    });
  });

  describe('when invoked with a non existing userId', function () {
    beforeEach(function () {
      engine = generateRetrieveEngineStubs().notFound;
      return retrieveUser(req, res, db, engine);
    });

    describe('it should call res.status()', function () {
      it('once', function () {
        assert(res.status.calledOnce);
      });
      it('with a 404 status code', function () {
        assert(res.status.calledWithExactly(404));
      });
    });

    describe('call res.set()', function () {
      it('once', function () {
        assert(res.set.calledOnce);
      });

      it('with "Content-Type" and "application/json" arguments', function () {
        assert(res.set.calledWithExactly('Content-Type', 'application/json'));
      });
    });

    describe('call res.json()', function () {
      it('once', function () {
        assert(res.json.calledOnce);
      });

      it('with an error message', function () {
        assert(res.json.calledWithExactly({ message: NOT_FOUND_ERROR.message }));
      });
    });
  });

  describe('when retrieveUser controller throws a generic error', function () {
    beforeEach(function () {
      engine = generateRetrieveEngineStubs().genericError;
      return retrieveUser(req, res, db, engine);
    });

    describe('should call res.status()', function () {
      it('once', function () {
        assert(res.status.calledOnce);
      });
      it('with a 500 status code', function () {
        assert(res.status.calledWithExactly(500));
      });
    });

    describe('should call res.set()', function () {
      it('once', function () {
        assert(res.set.calledOnce);
      });

      it('with "Content-Type" and "application/json" arguments', function () {
        assert(res.set.calledWithExactly('Content-Type', 'application/json'));
      });
    });

    describe('should call res.json()', function () {
      it('once', function () {
        assert(res.json.calledOnce);
      });

      it('with an error message', function () {
        assert(res.json.calledWithExactly({ message: GENERIC_ERROR.message }));
      });
    });
  });
});
