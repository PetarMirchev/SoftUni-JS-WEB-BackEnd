const router = require('express').Router();
const {isAuth, isGuestUser} = require('../middlewares/authenticationMiddleware');
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
        const errorMessage = extractErrorMessage(err);
        res.render('catalog', { err: errorMessage });
    }
});

//********************************************************************************************************* */

//DETAILS
router.get('/:cryptoId/details', async (req, res) => {
    try {
        //const crypto = await cryptoService.getOne(req.params.cryptoId);
        const electronics = await cryptoService.getOne(req.params.cryptoId).populate(["owner", "buyingList"]);//.lean(); // .lean() is put in Service // form Electronics Schema -->  buyingList: [{
        
        //check if user is owner by ID of this return true/false
        const isOwner = electronics.owner._id == req.user?._id;

        // check if user is existing (is already buy or vote)
        // const isBuyer = crypto.buyers?.some(id  => id == req.user?._id); //true/false
        const isBuyer = electronics.buyingList.some((x) => x._id.toString() === req.user?._id);//true/false // "buyingList" from mongo Schema->Electronics

        res.render('details', { ...electronics, isOwner, isBuyer }); // pass to the view.hbs --> data + isOwner + isBuyer?
    
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

        //crypto.dropDown = optionLevelDropDown(crypto.payment); //! <---- used to create DropDown menu in edit by dropDownMenuHelper.js

        res.render('edit', { crypto });
    } catch (err) {
        const errorMessage = extractErrorMessage(err);
        res.render('edit', { err: errorMessage })
    }
});

router.post('/:cryptoId/edit', isAuth, async (req, res) => {
        const cryptoId = req.params.cryptoId;
    try {
        const formData = req.body;
        const crypto = await cryptoService.edit(cryptoId, formData);

        res.redirect(`/${cryptoId}/details`);
    } catch (err) {
        const errorMessage = extractErrorMessage(err);
        res.render(`edit`, { err: errorMessage } );
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
    res.render('item/create');
});
//CREATE - POST
router.post('/create', isAuth, async (req, res) => {
    //const {name, image, price, description, payment} = req.body;
    const formData  = req.body;

    try {
        // manual check for numbers
        let productionTimeYear = Number(req.body.production);
        if (1700 >= productionTimeYear || productionTimeYear >= 2023){
            throw new Error(`The year should be a from 1700 to 2023!`);
        };

        let exploitationTimeYears = Number(req.body.exploitation);
        if (exploitationTimeYears < 0){
            throw new Error(`The exploitation should be a positive number!`);
        };

        let price = Number(req.body.price);
        if(price === 0 || price <= 0){
            throw new Error('The price should be a positive number!');
        }; 

        

        await cryptoService.create(req.user._id, formData);
        res.redirect('/catalog');
        
    } catch (err) {
        const errorMessage = extractErrorMessage(err);
        return res.status(400).render('item/create', { err: errorMessage} ); 
    }  
});

//****************************************************************************************************** */


// //! Search crypto
// router.get('/search', isAuth, async (req, res) => {
//     let cryptoSearchName = req.query.search;
//     let cryptoPay = req.query.payment; // req.query  ---> method="GET"
    
//     let cryptos;

//     try {
//         cryptos = await cryptoService.searchQuery(cryptoSearchName, cryptoPay);
   
//         if(cryptos === undefined){
//             cryptos = await cryptoService.getAll().lean();
//         }
             
//         res.render('search', { cryptos })
//     } catch (err) {
//         const errorMessage = extractErrorMessage(err); 
//         res.redirect('/404')
//     }
// });



// //! Search crypto - by 2 criteria
router.get('/search', isAuth, async (req, res) => {
    let searchName = req.query.name;
    let searchType = req.query.type; // req.query  ---> method="GET"
    
    let cryptos;

    try {
        cryptos = await cryptoService.searchQuery(searchName, searchType);// search by 2 criteria
   
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