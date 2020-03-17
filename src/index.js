import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';

import checkForEmptyPayload from './middleware/check-empty-payload';
import checkIfContentTypeIsSet from './middleware/check-content-type';
import checkIfContentTypeIsJson from './middleware/check-content-type-is-json';
import errorHandler from './middleware/error-handler';

import userRouter from './routes/user';
import logger from './utils/logger';
import documentation from '../spec/openapi/swagger.json';

const app = express();
app.set('strict routing', true);

app.use(cors());
app.use(helmet());
app.use(compression());

app.use(checkForEmptyPayload);
app.use(checkIfContentTypeIsSet);
app.use(checkIfContentTypeIsJson);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRouter);
app.use(errorHandler);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(documentation));

app.get('/', (req, res) => {
  res.redirect('/swagger');
});

app.listen(`${process.env.PORT}`, () => logger.info(
  `************user-directory server listening on port ${process.env.PORT}****************`,
));
