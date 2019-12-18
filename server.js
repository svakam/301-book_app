'use strict';

const express = require('express');
const app = express();
const superagent = require('superagent');
require('ejs');

const PORT = process.env.PORT || 3001;
app.use(express.static('./public'));
// says go to the view folder automatically when using ejs
app.set('view engine', 'ejs');
app.use(express.urlencoded());

function getForm(request, response) {
  response.render('pages/index');
}

function getBookInfo(request, response) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  let typeOfSearch = request.body.search[1];
  let searchQuery = request.body.search[0];
  if (typeOfSearch === 'title') {
    url += `+intitle:${searchQuery}`;
  }
  if (typeOfSearch === 'author') {
    url += `+inauthor:${searchQuery}`;
  }

  superagent.get(url)
    .then(results => {
      if (results.body.items) {
        let bookArr = results.body.items.map((object) => {
          return new Book(object.volumeInfo);
        });
        response.render('pages/searches/show', { bookArray: bookArr });
      }
      else {
        response.render('pages/error');
      }
    })
    .catch(error => console.error(error));
}

// add https:// to links if not already https://
let addHttps = (string) => {
  let domain = string.substr(0, 5);
  let prefix = 'https';

  if (string.substr(0, prefix.length) !== prefix) {
    string = string.substr(4, string.length);
    string = prefix + string;
  }
  return string;
}

// constructor
function Book(bookObj) {
  this.title = bookObj.title || 'no title available';
  if (bookObj.authors) {
    this.author = bookObj.authors[0] || 'no author available';
  }
  this.summary = bookObj.description || '(no description available)';
  if (bookObj.imageLinks) {
    this.image_url = addHttps(bookObj.imageLinks.thumbnail) || '(no image available)';
  }
}

app.get('/', getForm);

app.post('/searches', getBookInfo);

app.use('*', (request, response) => {
  response.render('pages/error');
})

app.listen(PORT, () => console.log(`listening on ${PORT}`));