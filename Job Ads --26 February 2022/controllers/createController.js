const router = require('express').Router();
const {isAuth} = require('../middlewares/authenticationMiddleware');
const crudService = require('../services/createServices');
const { extractErrorMessage } = require('../errorHelper.js');
const optionLevelDropDown = require('../dropDownMenuHelper');


//************************************************************************************************* */

//ALL ITEMS PAGE
// page render all items 
router.get('/catalog', async (req, res) => {
    try {
        const items = await crudService.getAll().lean();
        res.render("catalog", {items});
    } catch (err) {
        const errorMessage = extractErrorMessage(err);
        res.render('catalog', { error: errorMessage });
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
        //! depends of Task --> check is price 0 or -2222
        // let price = Number(req.body.price);
        // if(price === 0 || price <= 0){
        //     throw new Error('The price should be a positive number!');
        // };

        await crudService.create(req.user._id, formData);

        res.redirect('/catalog');
        
    } catch (err) {
        const errorMessage = extractErrorMessage(err);
        return res.status(400).render('item/create', { error: errorMessage} ); 
    }  
});

//****************************************************************************************************** */

//DETAILS
router.get('/:cryptoId/details', async (req, res) => {
    try {
        //! .populate(["owner", "votes"]) --->  за да мога да имам достъп до информацията за user-a
        const itemX = await crudService.getOne(req.params.cryptoId).populate(["owner", "votes"]).lean(); //  is put in Service
 
        //check if user is owner by ID of this post return -> true/false
        const isOwner = itemX.owner._id == req.user?._id;

        const whoIsOwner = await crudService.findOwner(itemX.owner); ///.lean() is put in Service

        // check if user is existing (is already buy crypto)
        const isVoted = itemX.votes.some((x) => x._id.toString() === req.use?._id); //true/false


        // let createDataInfo = await itemX.toObject();
        // let data1 = createDataInfo.votes;
        // //If there are people who voted, separate their emails with comma and space ", "
        // let emails = [];
        // data1.forEach((x) => emails.push(x.email));
        // emails.join(', ');

        res.render('details', { itemX, isOwner, isVoted, whoIsOwner }); // pass to the view.hbs --> data + isOwner + isBuyer?
    
    } catch (err) {
        const errorMessage = extractErrorMessage(err);
        res.status(401).render('details', { error: errorMessage });
    }   
});

//********************************************************************************************************** */

//EDIT
router.get('/:cryptoId/edit', isAuth, async (req, res) => {

    try {
        //!check for  not authorized attempt for edit the item (gard)
            // let redirectToHome = false;
            // if(req.user._id != post.owner){
            //     redirectToHome = true;
            //     throw new Error(`Cannot edit post you don't have created!`);
            // }
            // if(redirectToHome) {
            //     return res.redirect('/')
            // } //else { //res.redirect('') }


        //get info for the specified item & pass the data { crypto } to the edit.hbs for render 
        const crypto = await crudService.getOne(req.params.cryptoId);

        //crypto.dropDown = optionLevelDropDown(crypto.payment); //! <---- used to create DropDown menu in edit by dropDownMenuHelper.js

        res.render('edit', { crypto });
    } catch (err) {
        const errorMessage = extractErrorMessage(err);
        res.render('edit', { error: errorMessage })
    }
});

router.post('/:cryptoId/edit', isAuth, async (req, res) => {
        const cryptoData = req.body;
    try {
        const crypto = await crudService.edit(req.params.cryptoId, cryptoData);

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
        await crudService.delete(cryptoID);
        res.redirect('/catalog');
    } catch (err) {
        const errorMessage = extractErrorMessage(err);
        res.status(401).redirect('/details', { error: errorMessage });
    }    
});
//********************************************************************************************************* */



//!LIKE or BUY item
router.get('/:cryptoId/like', isAuth, async (req, res) => {

    const cryptoID = req.params.cryptoId;
    const userID = req.user._id;

    try {
        await crudService.buy(userID, cryptoID);
        res.redirect(`/${req.params.cryptoId}/details`);
    } catch (err) {     
        const errorMessage = extractErrorMessage(err);
        res.status(400).render(`details`, { error: errorMessage });
    }

});

//********************************************************************************************************** */


// //! Search crypto - by 2 criteria
// router.get('/search', isAuth, async (req, res) => {
//     let cryptoSearchName = req.query.search;
//     let cryptoPay = req.query.payment; // req.query  ---> method="GET"
    
//     let cryptos;

//     try {
//         cryptos = await crudService.searchQuery(cryptoSearchName, cryptoPay); // search by 2 criteria
   
//         if(cryptos === undefined){
//             cryptos = await crudService.getAll().lean();
//         }
             
//         res.render('search', { cryptos })
//     } catch (err) {
//         const errorMessage = extractErrorMessage(err); 
//         res.redirect('/404')
//     }
// });


//! search by 1 criteria (email of the author) / no results if search is empty
router.get('/search', isAuth, async (req, res) => {
    let resultToSearch = req.query.search;
    
    let matchSearches;

    try {
        
        if(resultToSearch === undefined){
           matchSearches = [];
        } else {
            matchSearches = await crudService.search1(resultToSearch); 
        }
             
        res.render('search', { matchSearches }); 
    } catch (err) {
        const errorMessage = extractErrorMessage(err); 
        res.redirect('/404');
    }
});



//************************************************************************************************************ */



//!PROFILE page whit user personal posts
// router.get('/profile', isAuth, async (req, res) => {

// let userId = req.user._id;

//     try {
//         let creatures = await crudService.getMyCreatedPost(userId);
//         let owner = await crudService.findOwner(userId);
//         // console.log(owner);

//         res.render('profile', { creatures, owner })
//     } catch (err) {  
//         const errorMessage = extractErrorMessage(err);
//         res.status(400).render(`404`, { error: errorMessage });
//     }    
// });


module.exports = router;