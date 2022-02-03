const express    = require('express'),
      controller = require('../controllers/usersController.js'),
      router     = express.Router();

router.post('/user', controller.getUserData);
router.post('/', controller.getUsers);

module.exports = router;