const express = require('express');
const app = express();
const port = 5050;

// use public folder
app.use(express.static('public'));


//***************************************************************************************************** */
//npm install express-handlebars
const handlebars = require('express-handlebars');

app.engine('.hbs', handlebars.engine({extname: '.hbs'}));  //engine({extname: '.hbs'}); !
app.set('view engine', '.hbs');
app.set('views', './views');


app.get('/', (req, res) => {
    res.render('home');
    //res.render('home',{ layout: false}); // to fix error if is not present main.hbs to render only this page --> ,{ layout: false});
});


app.get('/hbstest', (req, res) => {
    res.render('hbstest');
    //res.render('home',{ layout: false}); // to fix error if is not present main.hbs to render only this page --> ,{ layout: false});
});


app.get('/card/:cardId', (req, res) => {
   res.render('card', { cardId: req.params.cardId });
});


//render data for products
app.get('/products', (req, res) => {
    //array of object products
    const products = [
        { name: 'box', created: 'US', price: 5 },
        { name: 'key', created: 'UK', price: 1 },
        { name: 'apple', created: 'BG', price: 2 }
    ];

    // passing many objects/products to be render as catalogue 
    res.render('products' , { products });
});


//***************************************************************************************************** */
// routing syntax
// app.METHOD(PATH, HANDLER);
// test for postman

// GET data
app.get('/', (req, res) => {
    // res.status(200);
    // res.send('Welcome to backend! (GET)');
});

// CREATE data
app.post('/', (req, res) => {
    res.status(200);
    res.send('Create to backend! (POST)');
});

// UPDATE data
app.put('/', (req, res) => {
    res.status(200);
    res.send('Update data to backend! (PUT)');
});


// DELETE data
app.delete('/', (req, res) => {
    res.status(200);
    res.send('Delete data from backend! (DELETE)');
});


//****************************************************************************************** */

// Middleware integration tests

//! 'app.all() for all type requests (get, post, put, delete)'; 
app.all('/about', (req, res, next) => {
    console.log('Middleware execution..');
    next();
}, (req, res) => {
    res.status(200);
    res.send('<h1> first --> Middleware execution.. ---> Show /about page in browser!</h1>');
});



//! correct execution of middleware & declared of usage  <--------
let validateMiddlewareLogicIdNumberIsCorrect = (req, res, next) => {
    let cartId = Number(req.params.cartId); // convert string to Number, if is not will return 'NaN'

    if(!cartId){
       return res.send('<h1> Invalid ID of product! </h1>'); //or to -> res.redirect(/404);
    } else {
        next(); //call next logic in --> app.get('/product/:cartId',.....);
    }
};

app.get('/product/:cartId', validateMiddlewareLogicIdNumberIsCorrect, (req, res, next) => {
    res.send(`<h1>product is shown whit ID = ${req.params.cartId} !</h1>`);
});



//***************************************************************************************** */


//test params object
app.get('/test/:id', (req, res, next) => {
    res.status(200);
    const paramsObj = req.params;
    res.send(paramsObj);  // -->  {"id": "6876876"}
});


//  --> /user/42
app.get('/user/:id', function (req, res, next) {
    res.status(200);
    res.send(`<h1>this matches individual Page :id=${req.params.id}</h1>`);
});

//  --> /user/42/6300
app.get('/user/:id/:postCode', function (req, res, next) {
    res.status(200);
    res.send(`<h1>this matches individual Page -> /user/  :id=${req.params.id} , :postCode=${req.params.postCode}</h1>`);
});

// nested rout --> /user/42/details
app.get('/user/:id/details', function (req, res) {
    res.status(200);
    res.send(`<h1>matches specific user details /user/:id/details --> "/user/${req.params.id}/detail"</h1>`);
});


//************************************************************************************************************ */


//! redirect user rout logic
app.get('/redirect', (req,res) => {
    res.status(200);
    res.redirect('/point/redirected');
});
app.get('/point/redirected', (req, res) => {
    res.status(200);
    res.send('<h1>You have ben redirected!</h1>');
});



//******************************************************************************************************** */

//! DOWNLOAD recurses (images or files) from BackEnd
app.get('/get/image/dog/1', (req, res) => {  // app.get('/pdf', (req, res) => {
    res.status(200);
    res.download(`./dog.jpg`,);  // res.download(`FULL PATH TO PDF OR IMG!`);
    //alternative download method:
    //res.sendFile('PATH TO FILE', fileName);
});


//!alternative Open files in browser method for images or files from BackEnd
app.get('/pdf/1', (req, res) => {
    res.status(200);
    //this method opens pdf file in new tab on browser, not download it directly:
    let fileName = '/Certificate.pdf';
    // res.sendFile('PATH TO FILE', fileName);  // __dirname -- > The '__dirname' global variable resolves to the directory that contains the current file.
    res.sendFile('./Certificate.pdf' , {root: __dirname}); // alternative -->  //res.sendFile(__dirname + '/' + fileName);

    //! 3-t special case for sending files -> whit manual close on stream ( res.end() )!
    res.attachment('./Certificate.pdf'); // this is without end(); --> used to attach more information before close! 'res.end()' need to be writhe!
});


//*********************************************************************************************  ******** */


//! returning JSON object form Back-End --->  used in REACT application!
//res.json - send a JSON response
app.get('/json', (req, res) => {
    res.json({item: 'box', message: 'Hello form json!', available: true}); //-->Content-Type: application/json; charset=utf-8
});



//*********************************************************************************************************** */




app.get('*', (req, res) => {
    res.status(200);
    res.send(`<h1> * Matches everything! To be last rout in list of all for (404)</h1>`);
})




//*************************************************************************************************** */

app.listen(port, () => { console.log(`App run on: http://localhost:${port}`);});