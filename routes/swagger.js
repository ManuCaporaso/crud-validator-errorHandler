const router = require('express').Router();
const swaggeruI = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

router.use('/api-docs', swaggeruI.serve);
router.get('/api-docs', swaggeruI.setup(swaggerDocument));

module.exports = router;