const { Router } = require('express');
const validate = require('../../validators/validate');
const { rejectSchema } = require('../../validators/reservation.validator');
const controller = require('../../controllers/admin/bookingRequests.controller');

const router = Router();

router.get('/', controller.list);
router.post('/:id/approve', controller.approve);
router.post('/:id/reject', validate(rejectSchema), controller.reject);

module.exports = router;
