const router = require('express').Router();
const authService = require('../services/authServices');
const {isAuth} = require('../middlewares/authenticationMiddleware');
const { extractErrorMessage } = require('../errorHelper');



router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', async (req, res) => {
    //!can be changed in next project in login form --> name="email" or name="username", name="password" for register user
    const { email, password } = req.body;

    try {
        const token = await authService.login(email, password);

        res.cookie('auth', token, { httpOnly: true });  //{ httpOnly: true }
        res.redirect('/');

    } catch (err) {
        const errorMessage = extractErrorMessage(err);
        return res.status(401).render('auth/login', {  error: errorMessage} );
    }
   
});

//*************************************************************************************************** */

router.get('/register', (req, res) => {
    res.render('auth/register');
});


router.post('/register', async (req, res) => {

        try {
   
        //! can be change depending on project
        //in register.hbs take --> name="username", name="email", name="password", name="repeatPassword", name="confirmPassword"
        const { username, email, password, repeatPassword } = req.body;

        if(username === '' || email === '' || password === '' || repeatPassword === ''){
            throw new Error('All fields are required!');
        }

        if (!email || !password) {
            throw new Error('All fields are required!');
        }

        if (password !== repeatPassword) {
            throw new Error("Passwords don't match!");
        }

       
            const token = await authService.register( username, email, password, repeatPassword );
            
            // 'xxx' - name of the created cookie, & token
            // res.cookie('auth', token);  //{ httpOnly: true }
            // res.redirect('/'); // <--------------------------
            res.redirect('/login');   // <-----------------------

        } catch (error) {
            const errorMessage = extractErrorMessage(error);
            res.status(400).render('auth/register', { error: errorMessage} ); 
        }
});


//******************************************************************************************************** */

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie('auth');
    res.redirect('/');
});


//******************************************************************************************************** */

module.exports = router;