'use strict';

const express      = require('express'),
      bodyParser   = require('body-parser'),
      engine       = require('ejs-mate'),
      cookieParser = require('cookie-parser'),
      morgan       = require('morgan'),
      path         = require('path');



const { PORT } = require('./config');

const app = express();


// CONFIGURE APP
app.engine('ejs', engine);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));


// MIDDLEWARE
app.use(express.static(path.join(__dirname, 'public'))); // root folder for static files
app.use(morgan('common')); // log the http layer
app.use(bodyParser.json());
app.use(cookieParser());

// C.O.R.S.
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

// ROUTER
app.use(require('routes'));

// SSL CERT Endpoint
app.get('/.well-known/acme-challenge/GUzNCUB6tp4SXOfEVgUN2LvtgmY_chtlNg15zKlT78w', (req, res) => {
  res.send('GUzNCUB6tp4SXOfEVgUN2LvtgmY_chtlNg15zKlT78w.r9-HcCoTZgMpW4CXYteG58b6mRvZFzcFinana_zn71Q');
});

// fallback error message for all non-existant endpoints
app.use('*', (req, res) => {
    res.status(404).json({message: 'Not Found'});
});


// Listen for incoming requests
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
})