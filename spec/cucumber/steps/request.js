import superagent from 'superagent';
import { When } from 'cucumber';

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

When(/^it attaches a? (.+) payload which is missing the ([a-zA-Z0-9, ]+) field$/, function (payloadType, missingField) {
  this.requestPayload = getValidPayload(payloadType, this);

  const fieldsToDelete = convertStringToArray(missingField);

  fieldsToDelete.forEach((field) => delete this.requestPayload[field]);

  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json');
});

When(/^it attaches a? (.+) payload where the ([a-zA-Z0-9, ]+) field? (?:is|are)(\s+not)? a ([a-zA-Z]+)$/, function (payloadType, field, invert, fieldType) {
  this.requestPayload = getValidPayload(payloadType, this);

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
    .send(payload)
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
