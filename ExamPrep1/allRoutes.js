const router = require('express').Router();



const homeController = require("./controllers/homeController");
const authController = require("./controllers/authController");
const createController = require("./controllers/createController");


router.use(homeController);
router.use(authController);
router.use(createController); // or if we put /crypto/create on main.hbs--> ('/crypto', createController);


//if we have prefix '/auth' we use that:
// router.use('/auth', authController);




// error handler page sends
router.get("*", (req, res) => {
    res.redirect("/404");
});


module.exports = router;