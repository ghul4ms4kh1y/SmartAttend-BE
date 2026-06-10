const router = require('express').Router();
const ctrl = require('../controllers/users.controller');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { uploadProfile } = require('../middleware/upload');

router.get('/', auth, role, ctrl.getAll);
router.get('/:id', auth, role, ctrl.getOne);
router.put('/:id', auth, role, ctrl.update);
router.delete('/:id', auth, role, ctrl.remove);
router.post('/upload-photo', auth, uploadProfile.single('photo'), ctrl.uploadPhoto);

module.exports = router;
