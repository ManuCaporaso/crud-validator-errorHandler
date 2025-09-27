const router = require('express').Router();
const passport = require('passport');


router.use("/", require("./swagger"));
router.use('/dogs', require('./dogs'));
router.use('/cats', require('./cats'));

router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});


module.exports = router;