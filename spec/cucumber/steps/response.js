import assert from 'assert';
import { Then, When } from 'cucumber';
import objectPath from 'object-path';

import db from '../../../src/database/elasticsearch-setup';
import { convertStringToArray } from './utils';

const client = db;

When(/^it saves the response text in the context under ([\w.]+)$/, function (contextPath) {
  objectPath.set(this, contextPath, JSON.parse(this.response.text)._id);
});

Then(/^the payload object should be added to the database, grouped under the "([a-zA-Z]+)" type$/, async function (type) {
  this.type = type;

  await client.get({
    index: process.env.ELASTICSEARCH_INDEX,
    type,
    id: this.userId,
    _source_excludes: ['password'],
  }).then(({ _source }) => {
    this.requestPayload = objectPath.del(this.requestPayload, 'password');
    objectPath.del(_source, 'searchTerm');
    assert.deepEqual(_source, this.requestPayload);
  }).catch();
});

Then(/^our API should respond with a ([1-5]\d{2}) HTTP status code$/, function (statusCode) {
  assert.equal(this.response.statusCode, statusCode);
});

Then(/^the payload of the response should be an? ([a-zzA-Z0-9, ]+)$/, function (payloadType) {
  const contentType = this.response.headers['Content-Type'] || this.response.headers['content-type'];
  if (payloadType === 'JSON object' || payloadType === 'array') {
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

Then(/^the ([\w.]+) property of the response should be the same as context\.([\w.]+) but without the ([\w.]+) fields?$/, function (responseProperty, contextProperty, missingFields) {
  const requestContextObject = objectPath.get(this, contextProperty);
  const responseContextObject = objectPath.get(this.response, (responseProperty === 'root' ? '' : responseProperty));
  const fieldsToDelete = convertStringToArray(missingFields);

  fieldsToDelete.forEach((field) => delete requestContextObject[field]);
  delete responseContextObject.searchTerm;

  assert.deepEqual(requestContextObject, responseContextObject);
});

Then(/^should contain ([\d]+) items$/, function (count) {
  assert.equal(this.response.length, count);
});

Then(/^the first item of the response should contain a property ([\w.]+) set to (.+)$/, function (propertyPath, value) {
  assert.equal(objectPath.get(this.response[0], propertyPath), value);
});

Then(/^the ([\w.]+) property of the response should be an? ([\w.]+) with the value (.+)$/, function (responseProperty, expectedResponseType, expectedResponseValue) {
  const parseExpectedResponseValue = (function () {
    switch (expectedResponseType) {
      case 'object':
        return JSON.parse(expectedResponseValue);
      case 'string':
        return expectedResponseValue.replace(/^(?:["'])(.*)(?:["'])$/);
      default:
        return expectedResponseValue;
    }
  }());

  assert.deepEqual(objectPath.get(this.response, (responseProperty === 'root' ? '' : responseProperty)), parseExpectedResponseValue);
});

Then(/^the string should contain the word ([\w.]+)$/, function (word) {
  assert.deepEqual(this.response, word);
});
