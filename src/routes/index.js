'use strict';

const express    = require('express'),
      bodyParser = require('body-parser');

const controller = require('controllers');

const router = express.Router();


router.get('/', controller.getIndex);

module.exports = router;