require('dotenv').config();
require('express-async-errors');
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
