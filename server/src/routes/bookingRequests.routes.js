const { Router } = require('express');
const validate = require('../validators/validate');
const { createBookingRequestSchema } = require('../validators/bookingRequest.validator');
const controller = require('../controllers/bookingRequest.controller');

const router = Router();

router.post('/', validate(createBookingRequestSchema), controller.createBookingRequest);

module.exports = router;
