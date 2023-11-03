const router = require('express').Router();
const {isAuth} = require('../middlewares/authenticationMiddleware');
const cryptoService = require('../services/createServices');
const { extractErrorMessage } = require('../errorHelper.js');
const optionLevelDropDown = require('../dropDownMenuHelper');


//************************************************************************************************* */

//ALL ITEMS PAGE
// page render all items 
router.get('/catalog', async (req, res) => {
    try {
        const crypto = await cryptoService.getAll().lean();
        res.render("catalog", {crypto});
    } catch (err) {
        const errorMessage = extractErrorMessage(err)
        res.render('catalog', { error: errorMessage });
    }
});

//********************************************************************************************************* */

//DETAILS
router.get('/:cryptoId/details', async (req, res) => {
    try {
        const crypto = await cryptoService.getOne(req.params.cryptoId); // .lean() is put in Service
        //check if user is owner by ID of this return true/false
        const isOwner = crypto.owner == req.user?._id;
        // check if user is existing (is already buy crypto)
        const isBuyer = crypto.buyers?.some(id  => id == req.user?._id); //true/false

        res.render('details', { crypto, isOwner, isBuyer }); // pass to the view.hbs --> data + isOwner + isBuyer?
    
    } catch (err) {
        const errorMessage = extractErrorMessage(err);
        res.status(401).render('details', { error: errorMessage });
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
        res.status(400).render(`details`, { error: errorMessage });
    }

});

//********************************************************************************************************** */

//EDIT
router.get('/:cryptoId/edit', isAuth, async (req, res) => {
    try {
        //get info for the specified item & pass the data { crypto } to the edit.hbs for render 
        const crypto = await cryptoService.getOne(req.params.cryptoId);

        crypto.dropDown = optionLevelDropDown(crypto.payment); //! <---- used to create DropDown menu in edit by dropDownMenuHelper.js

        res.render('edit', { crypto });
    } catch (err) {
        const errorMessage = extractErrorMessage(err);
        res.render('edit', { error: errorMessage })
    }
});

router.post('/:cryptoId/edit', isAuth, async (req, res) => {
        const cryptoData = req.body;
    try {
        const crypto = await cryptoService.edit(req.params.cryptoId, cryptoData);

        res.redirect(`/${req.params.cryptoId}/details`);
    } catch (err) {
        const errorMessage = extractErrorMessage(err);
        res.render(`/${req.params.cryptoId}/edit`, { error: errorMessage, ...cryptoData });
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
        res.status(401).redirect('/details', { error: errorMessage });
    }    
});


//********************************************************************************************************* */
//! ---> create new items from user in the store 
// CREATE - render
router.get('/create', isAuth,  (req, res) => {
    res.render('item/create');
});
//CREATE - POST
router.post('/create', isAuth, async (req, res) => {
    //const {name, image, price, description, payment} = req.body;
    const formData  = req.body;

    try {
        //check is price 0 or -2222
        let price = Number(req.body.price);
        if(price === 0 || price <= 0){
            throw new Error('The price should be a positive number!');
        };

        await cryptoService.create(req.user._id, formData);
        res.redirect('/catalog');
        
    } catch (err) {
        const errorMessage = extractErrorMessage(err);
        return res.status(400).render('item/create', { error: errorMessage} ); 
    }  
});

//****************************************************************************************************** */


// //! Search crypto
router.get('/search', isAuth, async (req, res) => {
    let cryptoSearchName = req.query.search;
    let cryptoPay = req.query.payment; // req.query  ---> method="GET"
    
    let cryptos;

    try {
        cryptos = await cryptoService.searchQuery(cryptoSearchName, cryptoPay);
   
        if(cryptos === undefined){
            cryptos = await cryptoService.getAll().lean();
        }
             
        res.render('search', { cryptos })
    } catch (err) {
        const errorMessage = extractErrorMessage(err); 
        res.redirect('/404')
    }
});

module.exports = router;