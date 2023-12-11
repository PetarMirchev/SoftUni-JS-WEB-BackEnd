const jwt = require('../lib/jsonwebtoken');
const { SECRET } = require('../secretKey');


exports.authenticationMiddleware = async (req, res, next) => {
    
    const token = req.cookies['auth'];

    if(token) {
        try {
           const decodedToken =  await jwt.verify(token, SECRET);
           
           req.user = decodedToken;
           res.locals.user = decodedToken; // for navigation use 
           res.locals.isAuthenticated = true; // for navigation use in .hbs whe check the user

        } catch (error) {
            res.clearCookie('auth');
            return res.status(401).render('/404');
            //return res.status(401).redirect('/login');
        }    
    }

    next();
};


// //todo: Authorization - слага се само, където искамe да ауторизираме, да ли даден user има достъп?
exports.isAuth = (req, res, next) => {
    if(!req.user){
        return res.redirect('/login'); // 'auth/login'
    }

    next();
};


exports.isGuestUser = function (req, res, next) {
    if (!req.user) {
        next();
    } else {
        res.redirect('/');
    }
}
