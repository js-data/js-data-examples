<img src="https://raw.githubusercontent.com/js-data/js-data/master/js-data.png" alt="js-data logo" title="js-data" align="right" width="96" height="96" />

# js-data-examples

An example blog application using js-data v3.

## Run the app

### Pick a client

1. `cd client`
1. Pick a client
1. `cd <chosen-client>`
1. `npm install`
1. `npm run bundle`

### Start the server

1. `cd server`
1. `cp config.default.js config.js`
1. Edit `config.js` as appropriate
1. `npm install`
  1. And if MongoDB also run: `npm install mongodb bson`
  1. And if MySQL also run: `npm install knex mysql`
  1. And if Postgres also run: `npm install knex pg`
  1. And if Rethinkdb also run: `npm install rethinkdbdash`
  1. And if Sqlite also run: `npm install knex sqlite3`
1. `npm start`

## Clients

- [x] - [Angular 1.x](https://github.com/js-data/js-data-examples/tree/master/client/angular1)
- [x] - [Angular 2.x](https://github.com/js-data/js-data-examples/tree/master/client/angular2)
- [ ] - Aurelia
- [ ] - Ember
- [ ] - Mithril
- [x] - [React](https://github.com/js-data/js-data-examples/tree/master/client/react)
- [ ] - Vue

## Servers

- [ ] - MongoDB
- [ ] - MySQL
- [ ] - Postgres
- [x] - [RethinkDB](https://github.com/js-data/js-data-examples/tree/master/server/rethinkdb)
- [ ] - Sqlite

## License

The MIT License (MIT)

Copyright (c) 2014-2016 js-data-examples authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
