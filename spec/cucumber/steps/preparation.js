import { Given, Before } from 'cucumber';
import chance from 'chance';
import db from '../../../src/database/elasticsearch-setup';
import hashPassword from '../../../src/utils/hashPassword';

const client = db;
const Chance = chance.Chance();
Before(function () {
  return client.indices.delete({
    index: process.env.ELASTICSEARCH_INDEX,
  }).then(() => client.indices.create({
    index: process.env.ELASTICSEARCH_INDEX,
  }));
});

async function createUser() {
  const user = {};
  const password = 'paSSword#45';
  user.email = Chance.email({ domain: 'test.com' });
  user.password = hashPassword(password);
  const result = await client.index({
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'user',
    body: {
      email: user.email,
      password: user.password,
      searchTerm: user.email.replace(/[^\w-]/gi, '').trim(),
    },
    refresh: true,
  });
  user._id = result._id;
  return user;
}

function createUsers(count) {
  return Promise.all(Array.from(Array(count), createUser));
}

Given(/^(\w+) new users? (?:is|are) created with random password and email$/, async function (amount) {
  const count = Number.isNaN(parseInt(amount, 10)) ? 1 : parseInt(amount, 10);
  this.users = await createUsers(count);

  if (count > 1) {
    this.user1Id = this.users[1]._id;
  }

  const { email, _id } = this.users[0];
  this.email = email;
  this.userId = _id;
});


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
