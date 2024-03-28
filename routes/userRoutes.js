const express = require('express');
const controller = require('../controllers/userController');

const router = express.Router();

router.get('/', controller.index);
router.get('/signup', controller.signup);
router.post('/', controller.create);
router.get('/login', controller.login);
router.post('/login', controller.authenticate);

module.exports = router;