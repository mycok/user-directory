import express from 'express';

import errorHandler from './middleware/error-handler';
import userRouter from './routes/user';

const app = express();

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
