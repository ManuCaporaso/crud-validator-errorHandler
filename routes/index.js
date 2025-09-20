const router = require('express').Router();

router.get ('/', (req, res) => {
    res.send('Te manda saludos el chancho peludo.');
});

router.use('/Dogs', require('./dogs'));

module.exports = router;