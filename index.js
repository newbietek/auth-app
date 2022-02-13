require('dotenv').config();

const { PORT } = process.env;

const app = require('./app');

app.listen(PORT, () => console.info(`Listening at port ${PORT}...`));
