const router = require('express').Router();
const cubeService = require("./cubeService");

router.get('/', function (req, res) {
    const {search, from, to} = req.query;
    const cubes = cubeService.getAll(search, from, to);
    res.render("index", {cubes, search, from, to} )
});

router.get("/about", (req, res) => {
    res.render("about");
});

router.get("/404", function (req, res) {
    res.render("404");
});

module.exports = router;