const { Router } = require('express');
const validate = require('../../validators/validate');
const {
  createReservationSchema,
  rescheduleReservationSchema,
} = require('../../validators/reservation.validator');
const controller = require('../../controllers/admin/reservations.controller');

const router = Router();

router.get('/', controller.list);
router.post('/', validate(createReservationSchema), controller.create);
router.patch('/:id', validate(rescheduleReservationSchema), controller.reschedule);
router.delete('/:id', controller.cancel);

module.exports = router;
