import express from 'express';
import elasticsearch from 'elasticsearch';

import {
  checkForEmptyPayload,
  checkIfContentTypeIsSet,
  checkIfContentTypeIsJson,
  checkForRequiredFields,
  checkRequiredFieldsTypes,
  validateEmailAddress,
  validatePassword,
} from './middleware';

const app = express();
const client = new elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`,
});

app.use(checkForEmptyPayload);
app.use(checkIfContentTypeIsSet);
app.use(checkIfContentTypeIsJson);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/users', checkForRequiredFields, checkRequiredFieldsTypes, validateEmailAddress, validatePassword, function (req, res) {
  const { body } = req;

  client.index({
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'user',
    body,
  }).then(function (result) {
    return res
      .status(201)
      .set('Content-Type', 'text/plain')
      .send(result._id);
  }, function (err) {
    res
      .status(500)
      .json({ message: 'Iternal Server Error!' });
  });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && err.type === 'entity.parse.failed') {
    res.status(err.status).set({ 'Content-Type': 'application/json' }).json({ message: 'Payload should be in JSON format' });
    return;
  }
  next();
});

app.listen(`${process.env.PORT}`, () => {
  console.log(`HobNob API listening on port ${process.env.PORT}`);
});
