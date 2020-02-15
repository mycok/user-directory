import express from 'express';

import checkForEmptyPayload from './middleware/check-empty-payload';
import checkIfContentTypeIsSet from './middleware/check-content-type';
import checkIfContentTypeIsJson from './middleware/check-content-type-is-json';
import errorHandler from './middleware/error-handler';
import userRouter from './routes/user';

const app = express();

app.use(checkForEmptyPayload);
app.use(checkIfContentTypeIsSet);
app.use(checkIfContentTypeIsJson);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRouter);
app.use(errorHandler);

app.listen(`${process.env.PORT}`, () => {
  console.log(`
  ---------------------------------------------------------
  user-directory server listening on port ${process.env.PORT}
  ---------------------------------------------------------
  `);
});
