const router = require('express').Router();

const homeController = require('./controllers/homeController');
const cubeController = require('./controllers/cubeController');
const accessoriesController = require('./controllers/accessoryController');
const userController = require('./controllers/userController');


router.use(homeController);
router.use("/cubes", cubeController);
router.use("/accessories", accessoriesController);
router.use("/users", userController);


//error handler
router.get("*", (req, res) => {
    res.redirect("/404");
});


module.exports = router;