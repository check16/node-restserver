require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const app = express();

const bodyParser = require('body-parser');

// parse various different custom JSON types as JSON
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto: ', process.env.PORT);
});