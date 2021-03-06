require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

//Habilitamos la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto: ', process.env.PORT);
});