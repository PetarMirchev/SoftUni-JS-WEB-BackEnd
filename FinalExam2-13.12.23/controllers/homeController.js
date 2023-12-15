const router = require('express').Router();
const cryptoService = require('../services/createServices');
const { extractErrorMessage } = require('../errorHelper.js');
const authServices = require('../services/authServices.js');


router.get('/', async (req, res) => {

    try {
        const posts = await cryptoService.getLast3().lean();
        res.render("index", {posts});
    } catch (err) {
        const errorMessage = extractErrorMessage(err);
        res.render('index', { err: errorMessage });
    }
});


router.get("/404", function (req, res) {
    res.render("404");
});


module.exports = router;