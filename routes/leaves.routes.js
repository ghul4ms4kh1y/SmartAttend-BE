const router = require('express').Router();
const ctrl = require('../controllers/leaves.controller');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { uploadAttachment } = require('../middleware/upload');

router.post('/', auth, ctrl.create);
router.get('/me', auth, ctrl.getMine);
router.get('/', auth, role, ctrl.getAll);
router.put('/:id/:status', auth, role, ctrl.updateStatus);
router.post('/:id/upload', auth, uploadAttachment.single('attachment'), ctrl.uploadAttachment);

module.exports = router;
