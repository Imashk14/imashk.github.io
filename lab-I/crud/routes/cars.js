const express = require('express');
const carController = require('../controllers/carController');

const router = express.Router();

router.get('/', carController.index);
router.get('/new', carController.createForm);
router.post('/', carController.create);
router.get('/:id', carController.show);
router.get('/:id/edit', carController.editForm);
router.post('/:id', carController.update);
router.post('/:id/delete', carController.remove);

module.exports = router;

