const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

router.get('/s3URL', uploadController.getUploadUrl);

module.exports = router;
