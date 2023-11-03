const router = require('express').Router();
const crudService = require('../services/createServices');
const { extractErrorMessage } = require('../errorHelper.js');


router.get('/', async (req, res) => {

    //! special case for last 3 posts to be displayed
    try {
       const offers = await crudService.lastThree().lean();

       res.render("index", {offers});

    } catch (err) {
        const errorMessage = extractErrorMessage(err);
        res.render('/', { error: errorMessage });
    }  
});


router.get("/404", function (req, res) {
    res.render("404");
});


module.exports = router;