const router = require('express').Router();
const ctrl = require('../controllers/departments.controller');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', auth, ctrl.getAll);
router.post('/', auth, role, ctrl.create);
router.put('/:id', auth, role, ctrl.update);
router.delete('/:id', auth, role, ctrl.remove);

module.exports = router;
