import superagent from 'superagent';
import { When } from 'cucumber';
import objectPath from 'object-path';

import { getValidPayload, convertStringToArray, processPath } from './utils';

const baseUrl = `${process.env.HOSTNAME}:${process.env.PORT}`;

When(/^a client creates a (GET|POST|PATCH|PUT|DELETE|OPTIONS|HEAD) request to ([/\w-:.]+)$/, function (method, path) {
  const processedPath = processPath(this, path);
  this.request = superagent(method, `${baseUrl}${processedPath}`);
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

When(/^it sets the HTTP header field (?:"|')?([\w-]+)(?:"|')? to (?:"|')?(.+)(?:"|')?$/, function (headerName, value) {
  this.request.set(headerName, value);
});

When(/^it sets the Authorization header to a token with a wrong signature$/, function () {
  // Appending anything to the end of the signature will invalidate it
  const tokenWithInvalidSignature = `${this.token}a`;
  this.request.set('Authorization', `Bearer ${tokenWithInvalidSignature}`);
});

When(/^it sets the Authorization header to a valid token signature$/, function () {
  this.request.set('Authorization', `Bearer ${this.token}`);
});

When(/^it attaches a? (.+) payload which is missing the ([a-zA-Z0-9, ]+) field$/, function (payloadType, missingField) {
  this.requestPayload = getValidPayload(payloadType, this);

  const fieldsToDelete = convertStringToArray(missingField);

  fieldsToDelete.forEach((field) => delete this.requestPayload[field]);

  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json');
});

When(/^it attaches a? (.+) payload where the ([a-zA-Z0-9,]+) field? (?:is|are) exactly (.+)$/, function (payloadType, field, value) {
  this.requestPayload = getValidPayload(payloadType, this);
  const fieldsToModify = convertStringToArray(field);

  fieldsToModify.forEach((fieldName) => {
    this.requestPayload[fieldName] = value;
  });

  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json');
});

When(/^it attaches a valid (.+) payload$/, function (payloadType) {
  this.requestPayload = getValidPayload(payloadType, this);
  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json');
});

When(/^it attaches (.+) as payload$/, function (payload) {
  this.requestPayload = JSON.parse(payload);
  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json');
});

When(/^it attaches an? (.+) payload with additional ([a-zA-Z0-9, ]+) fields?$/, function (payloadType, additionalField) {
  this.requestPayload = getValidPayload(payloadType, this);
  const fieldsToAdd = convertStringToArray(additionalField);

  fieldsToAdd.forEach((field) => objectPath.set(this.requestPayload, field, 'foo'));

  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json');
});

When(/^it attaches an? (.+) payload where the ([a-zA-Z0-9., ]+) field? (?:is|are)(\s+not)? a ([a-zA-Z]+)$/, function (payloadType, fields, invert, type) {
  this.requestPayload = getValidPayload(payloadType, this);
  const typeKey = type.toLowerCase();
  const invertKey = invert ? 'not' : 'is';
  const sampleObjects = {
    object: {
      is: {},
      not: 'string',
    },
    string: {
      is: 'string',
      not: {},
    },
  };
  const fieldsToAdd = convertStringToArray(fields);

  fieldsToAdd.forEach((field) => objectPath.set(
    this.requestPayload, field, sampleObjects[typeKey][invertKey],
  ));

  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json');
});

When(/^sets (?:"|')(.+)(?:"|') as the query parameter$/, function (queryString) {
  return this.request
    .query(queryString);
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
