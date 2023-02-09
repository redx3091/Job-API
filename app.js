require('dotenv').config();
require('express-async-errors');

//* Extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const express = require('express');
const app = express();

//* ConnectDB
const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');

//* Routers
const authRouter = require('./routes/auth.router');
const jobsRouter = require('./routes/Job.router');

//* error handler
const NotFound = require('./middleware/not-found');
const ErrorHandler = require('./middleware/error-handler');

app.use(express.json());
//*extra packages
app.set('trus proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, //* 15 minutes
    max: 100, //* limit each IP to 100 request per windoiwMs
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());

//*routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

app.use(NotFound);
app.use(ErrorHandler);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
