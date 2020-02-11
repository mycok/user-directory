import { Given } from 'cucumber';
import db from '../../../src/database/elasticsearch-setup';

const client = db;

Given(/^(\d+|all) documents in the (?:"|')([\w-]+)(?:"|'') sample are added to the index with type (?:"|')([\w-]+)(?:"|'')$/, function (count, sourceFile, type) {
  const numericCount = Number.isNaN(parseInt(count, 10)) ? Infinity : parseInt(count, 10);
  if (numericCount < 1) {
    return undefined;
  }
  //   read data file
  const source = require('../samples/random-user-data.json');
  // map the data to an array of objects as expected by elasticsearch's API
  const action = {
    index: {
      _index: process.env.ELASTICSEARCH_INDEX,
      _type: type,
    },
  };
  const operations = [];
  const len = source.length;

  for (let index = 0; index < len && index < numericCount; index += 1) {
    operations.push(action);
    operations.push(source[index]);
  }
  //   do a bulk insert
  // refreshing the index to make sure it is immediately searchable in subsquent steps
  return client.bulk({
    body: operations,
    refresh: true,
  });
});
