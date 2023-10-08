module.exports  = function customCookieUsingLibraryUUID(){

//!custom cookie-parser using library 'uuid' 
    const express = require('express');
    const app = express();
    const PORT = 8080;

    //random cookie generation library --> npm install uuid
    const {v4: uuid} = require('uuid');


    app.get("/", (req, res) => {
        let id;
        const cookie = req.headers["cookie"];

        if(cookie){
            //
            const [key, value] = cookie.split("=");
            id = value;
            console.log({key});
            console.log({value});


        } else {
            id =uuid();
            res.header("Set-Cookie", `userId=${id}`);
        }
        res.status(200);
        //OK! ID: 9eabf874-6354-4af4-9d5e-5e7ef0923f3c
        res.send("OK! ID: " + id);    
    }) 


    app.listen(PORT, () => { console.log(`App run on: http://localhost:${PORT}`);});

} 

