import assert from 'assert';

import superagent from 'superagent';
import { When, Then } from 'cucumber';
import elasticsearch from 'elasticsearch';

import { getValidPayload, convertStringToArray } from './utils';

const baseUrl = `${process.env.HOSTNAME}:${process.env.PORT}`;
const client = new elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`,
});

When(/^a client creates a (GET|POST|PATCH|PUT|DELETE|OPTIONS|HEAD) request to ([/\w-:.]+)$/, function (method, path) {
  this.request = superagent(method, `${baseUrl}${path}`);
});

When(/^it attaches a generic (.+) payload$/, function (payloadType) {
  switch (payloadType) {
    case 'malformed JSON':
      this.request
        .send('{"email": "mycovan", name }')
        .set('Content-Type', 'application/json');
      break;
    case 'non JSON':
      this.request
        .send(
          `
        <?xml version="1.0" encoding="UTF-8">
        <email>mycovan@gmail.com</email>
        `,
        )
        .set('Content-Type', 'text/xml');
      break;
    case 'empty':
    default:
  }
});

When(/^without setting the (?:"|')([\w-]+)(?:"|') property$/, function (headerName) {
  this.request.unset(headerName);
});

When(/^it attaches a? (.+) payload which is missing the ([a-zA-Z0-9, ]+) field$/, function (payloadType, missingField) {
  this.requestPayload = getValidPayload(payloadType);

  const fieldsToDelete = convertStringToArray(missingField);

  fieldsToDelete.forEach((field) => delete this.requestPayload[field]);

  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json');
});

When(/^it attaches a? (.+) payload where the ([a-zA-Z0-9, ]+) field? (?:is|are)(\s+not)? a ([a-zA-Z]+)$/, function (payloadType, field, invert, fieldType) {
  this.requestPayload = getValidPayload(payloadType);

  const typeKey = fieldType.toLowerCase();
  const invertKey = invert ? 'not' : 'is';

  const sampleValues = {
    string: {
      is: 'string',
      not: 10,
    },
  };

  const fieldsToModify = convertStringToArray(field);

  fieldsToModify.forEach((fieldName) => {
    this.requestPayload[fieldName] = sampleValues[typeKey][invertKey];
  });

  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json');
});

When(/^it attaches a? (.+) payload where the ([a-zA-Z0-9,]+) field? (?:is|are) exactly (.+)$/, function (payloadType, field, value) {
  this.requestPayload = getValidPayload(payloadType);
  const fieldsToModify = convertStringToArray(field);

  fieldsToModify.forEach((fieldName) => {
    this.requestPayload[fieldName] = value;
  });

  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json');
});

When(/^it attaches a valid (.+) payload$/, function (payloadType) {
  this.requestPayload = getValidPayload(payloadType);
  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json');
});

When(/^it sends the request$/, function (callback) {
  this.request
    .then((response) => {
      this.response = response.res;
      callback();
    })
    .catch((errResponse) => {
      this.response = errResponse.response;
      callback();
    });
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

Then('the newly created user should be deleted', function (callback) {
  client.delete({
    index: process.env.ELASTICSEARCH_INDEX,
    type: this.type,
    id: this.response,
  }).then(function (res) {
    assert.equal(res.result, 'deleted');
    callback();
  }).catch(callback);
});
