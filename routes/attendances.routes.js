const router = require('express').Router();
const ctrl = require('../controllers/attendances.controller');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.post('/check-in', auth, ctrl.checkIn);
router.put('/check-out', auth, ctrl.checkOut);
router.get('/me', auth, ctrl.getMyHistory);
router.get('/', auth, role, ctrl.getAll);

module.exports = router;
