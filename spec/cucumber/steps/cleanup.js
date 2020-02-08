import assert from 'assert';
import { Then } from 'cucumber';
import objectPath from 'object-path';

import db from '../../../src/database/elasticsearch-setup';

const client = db;

Then(/^the entity of type (\w+), with ID stored under ([\w.]+), should be deleted$/, function (type, idPath) {
  return client.delete({
    index: process.env.ELASTICSEARCH_INDEX,
    type,
    id: objectPath.get(this, idPath),
    refresh: true,
  }).then((res) => assert.equal(res.result, 'deleted'));
});
