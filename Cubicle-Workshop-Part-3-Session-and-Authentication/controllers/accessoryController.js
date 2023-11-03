const router = require('express').Router();
const accessoryService = require('../services/accessoryService');

router.get('/create', (req, res) => {
    res.render("accessory/create");
});


router.post('/create', async (req, res) => {
    //console.log(req.body);
    const { name, description, imageUrl } = req.body;
    accessoryService.create( { name, description, imageUrl});
    res.redirect("/");
});


module.exports = router;