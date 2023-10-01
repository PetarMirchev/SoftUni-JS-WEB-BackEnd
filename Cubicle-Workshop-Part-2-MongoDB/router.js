const router = require('express').Router();

const homeController = require('./controllers/homeController');
const cubeController = require('./controllers/cubeController');
const accessoriesController = require('./controllers/accessoryController');


router.use(homeController);
router.use("/cubes", cubeController);
router.use("/accessories", accessoriesController);


//error handler
router.get("*", (req, res) => {
    res.redirect("/404");
});


module.exports = router;