const { Router } = require('express');
const validate = require('../validators/validate');
const { availabilityQuerySchema } = require('../validators/availability.validator');
const controller = require('../controllers/availability.controller');

const router = Router();

router.get('/', validate(availabilityQuerySchema, 'query'), controller.getAvailability);

module.exports = router;
