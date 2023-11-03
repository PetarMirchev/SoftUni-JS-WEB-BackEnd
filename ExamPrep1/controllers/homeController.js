const router = require('express').Router();


router.get('/', (req, res) => {
    // console.log(req.user);
    res.render("index");
});


router.get("/404", function (req, res) {
    res.render("404");
});


module.exports = router;