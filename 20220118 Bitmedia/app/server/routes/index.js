const express    = require('express'),
      controller = require('../controllers/indexController.js'),
      router     = express.Router();

router.get('/', controller.getStartPage);

module.exports = router;