const express = require('express');
const app = express();
const port = 5050;

//*********************** static folder assets (CSS, images, fonts..) ****************************** */
const path = require("path");
app.use(express.static(path.resolve(__dirname, "./public")));
app.use(express.urlencoded({ extended: false }));
//************************************************************************************************** */




//***********  DB connect  *********************************************************************** */
const connectionToDB = require('./controllers/dbConfig');
connectionToDB();
//************************************************************************************************* */



//**********  handlebars configuration  ********************************************************************/
const handlebars = require('express-handlebars');

app.engine('.hbs', handlebars.engine({extname: '.hbs'}));  //engine({extname: '.hbs'}); ! --> by default search views/layouts/main.hbs
//!engine({extname: '.hbs',  layoutsDir: 'newFolder'}); --> to change the directory of layouts
//!app.engine('.hbs', handlebars.engine({extname: '.hbs', defaultLayout: 'index' })); ---> change main.hbs to be index.hbs
app.set('view engine', '.hbs');
app.set('views', './views');
//*** ******************************************************************************************************

const { auth } = require("./middlewares/authMiddleware");
app.use(auth);

//********************** custom middleware for page routes  ***************************************/
const routers = require('./router');
app.use(routers);
//********************************************************************************************** */

app.listen(port, () => { console.log(`App run on: http://localhost:${port}`);});