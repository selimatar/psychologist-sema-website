const { Router } = require('express');
const validate = require('../validators/validate');
const { loginSchema } = require('../validators/auth.validator');
const controller = require('../controllers/auth.controller');

const router = Router();

router.post('/login', validate(loginSchema), controller.login);

module.exports = router;
