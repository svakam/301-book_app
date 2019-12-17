'use strict';

const express = require('express');
const app = express();
const superagent = require('superagent');
require('ejs');

const PORT = 3000;
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded());

function getForm(request, response) {
  response.render('pages/index');
}

app.get('/', getForm);

app.get('/searches', (request, response) => {
  response.send('searches');
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));