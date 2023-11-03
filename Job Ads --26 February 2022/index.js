const express = require('express');
const app = express();
const port = 5050;




//*********************** static folder assets (CSS, images, fonts..) ****************************** */
const path = require('path');

//!!! (change path to assets folder)
app.use('/static', express.static("public")); // resolve "./static/css/styles.css" --> to  "./public/css/styles.css" 
app.use(express.urlencoded({ extended: false })); // to stop using https://www.npmjs.com/package/qs on back for deep query url to convert in structure in obj,array structures
//app.use(express.static(path.resolve(__dirname, "./static"))); //--> "./public" folder to read CSS...

//************************************************************************************************** */



//***********  DB connect  *********************************************************************** */
const connectionToDB = require('./controllers/dbConfig');
connectionToDB();
//************************************************************************************************* */




//"cors" for fix Access to XMLHttpRequest at '...' from origin 'localhost:3000' has been blocked by CORS policy in development mode 
// const cors = require('cors');
// app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  //res.header('Access-Control-Allow-Credentials', true);
 
  next();
});




//**********  handlebars configuration  ********************************************************************/
const handlebars = require('express-handlebars');

app.engine('.hbs', handlebars.engine({extname: '.hbs'}));  //engine({extname: '.hbs'}); ! --> by default search views/layouts/main.hbs
//!engine({extname: '.hbs',  layoutsDir: 'newFolder'}); --> to change the directory of layouts
//!app.engine('.hbs', handlebars.engine({extname: '.hbs', defaultLayout: 'index' })); ---> change main.hbs to be index.hbs
app.set('view engine', '.hbs');
app.set('views', './views');
//*** ****************************************************************************************************** /



//**********  cookieParser  *************************************************************************/
const cookieParser = require('cookie-parser');
app.use(cookieParser());
//********************************************************************************************************** /



//********************** auth middleware *****************************************************************/

const {authenticationMiddleware} = require('./middlewares/authenticationMiddleware');
app.use(authenticationMiddleware);

//********************************************************************************************************** /



//********************** custom middleware for page routes  ***************************************/
const routers = require('./allRoutes');
app.use(routers);
//********************************************************************************************** */

app.listen(port, () => { console.log(`App run on: http://localhost:${port}`);});