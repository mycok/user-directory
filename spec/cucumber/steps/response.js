import assert from 'assert';
import { Then, When } from 'cucumber';
import objectPath from 'object-path';

import db from '../../../src/database/elasticsearch-setup';

const client = db;

When(/^it saves the response text in the context under ([\w.]+)$/, function (contextPath) {
  objectPath.set(this, contextPath, this.response.text);
});

Then(/^the payload object should be added to the database, grouped under the "([a-zA-Z]+)" type$/, function (type, callback) {
  this.type = type;

  client.get({
    index: process.env.ELASTICSEARCH_INDEX,
    type,
    id: this.response,
  }).then((result) => {
    assert.deepEqual(result._source, this.requestPayload);
    callback();
  }).catch(callback);
});

Then(/^our API should respond with a ([1-5]\d{2}) HTTP status code$/, function (statusCode) {
  assert.equal(this.response.statusCode, statusCode);
});

Then(/^the payload of the response should be a? ([a-zzA-Z0-9, ]+)$/, function (payloadType) {
  const contentType = this.response.headers['Content-Type'] || this.response.headers['content-type'];
  if (payloadType === 'JSON object') {
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response not of content-type application/json');
    }
    try {
      this.response = JSON.parse(this.response.text);
    } catch (err) {
      throw new Error('Response not a valid JSON object');
    }
  } else if (payloadType === 'string') {
    if (!contentType || !contentType.includes('text/plain')) {
      throw new Error('Response not of content type text/plain');
    }

    this.response = this.response.text;
    if (typeof this.response !== 'string') {
      throw new Error('Response not a string');
    }
  }
});

Then(/^should contain a message property stating that (?:"|')(.*)(?:"|')$/, function (message) {
  assert.equal(this.response.message, message);
});

Then(/^the ([\w.]+) property of the response should be the same as context\.([\w.]+)$/, function (responseProperty, contextProperty) {
  assert.deepEqual(objectPath.get(this.response, (responseProperty === 'root' ? '' : responseProperty)), objectPath.get(this, contextProperty));
});
