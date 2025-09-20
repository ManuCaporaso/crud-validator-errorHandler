const router = require('express').Router();

router.get ('/', (req, res) => {
    res.send('Te manda saludos el chancho peludo.');
});

router.use('/dogs', require('./dogs'));
router.use('/cats', require('./cats'));


module.exports = router;