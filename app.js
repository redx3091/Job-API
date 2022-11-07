require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

//* error handler
const NotFound = require('./middleware/not-found');
const ErrorHandler = require('./middleware/error-handler');

app.use(express.json());
//*extra packages

//*routes
app.get('/', (req, res) => {
    res.send('Jobs API');
});

app.use(NotFound);
app.use(ErrorHandler);

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
}

start();
