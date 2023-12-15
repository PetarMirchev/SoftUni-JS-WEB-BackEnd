const router = require('express').Router();
const authService = require('../services/authServices');
const {isAuth, isGuestUser} = require('../middlewares/authenticationMiddleware');
const { extractErrorMessage } = require('../errorHelper');



router.get('/login', isGuestUser, (req, res) => {
    res.render('auth/login');
});

router.post('/login', isGuestUser, async (req, res) => {
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

router.get('/register', isGuestUser,  (req, res) => {
    res.render('auth/register');
});


router.post('/register', isGuestUser, async (req, res) => {

        try {
   
        //! can be change depending on project
        //in register.hbs take --> name="username", name="email", name="password", name="repeatPassword", name="confirmPassword"
        const { username, email, password, repeatPassword } = req.body;

        if(username === '' || email === '' || password === '' || repeatPassword === ''){
            throw new Error('All fields are required!');
        }
        if(username.length < 2) {
            throw new Error('characters required minimum with 2 length');
        }
        if(email.length < 10) {
            throw new Error('characters required minimum with 10 length');
        }
        if (password.trim().length < 4) {
            throw new Error('Password must be at least 4 characters long');
        }

        if (password !== repeatPassword) {
            throw new Error("Passwords don't match!");
        }

            const token = await authService.register( username, email, password );    
            //res.redirect('/login');   // <-----------------------

            //!name of the created cookie, & token  for Auto-login user after registration!
            res.cookie('auth', token);  //{ httpOnly: true }
            res.redirect('/'); // <--------------------------

           

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