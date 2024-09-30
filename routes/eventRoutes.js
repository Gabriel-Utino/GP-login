const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const isAuthenticated = require('../middleware/isAuthenticated');
const authorize = require('../middleware/authorize');

// イベント関連のルート
router.post('/create', isAuthenticated, authorize(['Criar Eventos']), eventController.createEvent);

module.exports = router;
