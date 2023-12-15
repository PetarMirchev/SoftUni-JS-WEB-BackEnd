const router = require('express').Router();
const {isAuth, isOwner} = require('../middlewares/authenticationMiddleware');
const cryptoService = require('../services/createServices');
const { extractErrorMessage } = require('../errorHelper.js');
const authServices = require('../services/authServices.js');



//************************************************************************************************* */

//ALL ITEMS PAGE
// page render all items 
router.get('/catalog', async (req, res) => {
    try {
        const crypto = await cryptoService.getAll().lean();
        res.render("catalog", {crypto});
    } catch (err) {
        const errorMessage = extractErrorMessage(err);
        res.render('catalog', { err: errorMessage });
    }
});

//********************************************************************************************************* */

//DETAILS
router.get('/:cryptoId/details', async (req, res) => {

    try {
        const curse = await cryptoService.getOne(req.params.cryptoId).populate(["owner", "signUpList"]);//.lean(); // .lean() is put in Service // form Electronics Schema -->  buyingList: [{

        //find owner of the Curse
        const userOwner = await authServices.findOwner(curse.owner).lean();
        //const myCurses = await cryptoService.getOwnerCreatedCurse(req.user._id).lean();
        const participantsUsers = curse.signUpList;

        
        //check if user is owner by ID of this return true/false
        const isOwner = curse.owner._id == req.user?._id;

        // check if user is existing (is already buy or vote)
        const isBuyer = curse.signUpList.some((x) => x._id.toString() === req.user?._id);//true/false // "buyingList" from mongo Schema->Electronics

        res.render('details', { ...curse, isOwner, isBuyer, userOwner, participantsUsers,}); // pass to the view.hbs --> data + isOwner + isBuyer?
    
    } catch (err) {
        const errorMessage = extractErrorMessage(err);
        res.status(401).render('details', { err: errorMessage });
    }   
});

//********************************************************************************************************** */

//LIKE or BUY item
router.get('/:cryptoId/buy', isAuth, async (req, res) => {

    const cryptoID = req.params.cryptoId;
    const userID = req.user._id;

    try {
        await cryptoService.buy(userID, cryptoID);
        res.redirect(`/${req.params.cryptoId}/details`);
    } catch (err) {     
        const errorMessage = extractErrorMessage(err);
        res.status(400).render(`details`, { err: errorMessage });
    }

});

//********************************************************************************************************** */

//EDIT
router.get('/:cryptoId/edit', isAuth, async (req, res) => {
    try {
        //get info for the specified item & pass the data { crypto } to the edit.hbs for render 
        const crypto = await cryptoService.getOne(req.params.cryptoId);

        res.render('edit', { crypto });
    } catch (error) {
        const errorMessage = extractErrorMessage(error);
        res.render('edit', { error: errorMessage })
    }
});

router.post('/:cryptoId/edit', isAuth,  async (req, res) => {
        const cryptoId = req.params.cryptoId;
        const crypto = await cryptoService.getOne(req.params.cryptoId);
    try {
        const formData = req.body;
        const crypto = await cryptoService.edit(cryptoId, formData);

        res.redirect(`/${cryptoId}/details`);
    } catch (error) {
        const errorMessage = extractErrorMessage(error);
        res.render(`edit`, { error: errorMessage , crypto } );
    }
});

//********************************************************************************************************* */

// DELETE
router.get('/:cryptoId/delete', isAuth, async (req, res) => {
    try {
        // ofter click of delete button & delete item & go to all items page .redirect('/...');
        const cryptoID = req.params.cryptoId;
        await cryptoService.delete(cryptoID);
        res.redirect('/catalog');
    } catch (err) {
        const errorMessage = extractErrorMessage(err);
        res.status(401).redirect('/details', { err: errorMessage });
    }    
});


//********************************************************************************************************* */
//! ---> create new items from user in the store 
// CREATE - render
router.get('/create', isAuth,  (req, res) => {
    res.render('create');
});
//CREATE - POST
router.post('/create', isAuth, async (req, res) => {
    //const {name, image, price, description, payment} = req.body;
    const formData  = req.body;

    try {
        let price = Number(req.body.price);
        if(price === 0 || price <= 0){
            throw new Error('The price should be a positive number!');
        }; 

        await cryptoService.create(req.user._id, formData);
        res.redirect('/catalog');
        
    } catch (error) {
        const errorMessage = extractErrorMessage(error);
        return res.status(400).render('create', { error: errorMessage} ); 
    }  
});

//****************************************************************************************************** */

//!PROFILE - BONUS
router.get('/profile', isAuth, async (req, res) => {
    try {
        const user = await authServices.findOwner(req.user._id).lean()//.populate('signUpList').lean()

        //get all user created Curses 
        const myCurses = await cryptoService.getOwnerCreatedCurse(req.user._id).lean();
        const countMyCurses = Number(myCurses.length); // 0, 2, 10

        const mySubscription = await cryptoService.getOwnerSignUpList(req.user._id).lean();
        const countMySubscription = Number(mySubscription.length);  // 0, 2, 10

        res.render("profile", { user, myCurses, mySubscription, countMyCurses, countMySubscription});
    } catch (err) {
        const errorMessage = extractErrorMessage(err);
        res.render('profile', { err: errorMessage });
    }
});



module.exports = router;