module.exports  =  function customSessionExpress(){
    const express = require('express');
    const app = express();
    const cookieParser = require('cookie-parser');

    //npm install express-session
    const session = require('express-session');
    
    const {v4: uuid} = require('uuid');
    const PORT = 8080;
    

    app.use(cookieParser());

    app.use(
        session({
            secret: 'my random secret!',
            resave: false,
            cookie: {secure: false},
        })
    );  

    app.get("/", (req, res) => {
        let id;
        const userId = req.cookies["userId"];
      
        if (userId) {
          id = userId;
          console.log(req.session);
        } else {
          id = uuid();
          res.cookie("userId", id);
        }
      
        res.send("ok! ID: " + id);
      });



    app.listen(PORT, () => { console.log(`App run on: http://localhost:${PORT}`);});
}