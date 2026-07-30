const { Router } = require('express');
const requireAdminAuth = require('../../middleware/requireAdminAuth');
const bookingRequestsRoutes = require('./bookingRequests.routes');
const reservationsRoutes = require('./reservations.routes');

const router = Router();

router.use(requireAdminAuth);
router.use('/booking-requests', bookingRequestsRoutes);
router.use('/reservations', reservationsRoutes);

module.exports = router;
