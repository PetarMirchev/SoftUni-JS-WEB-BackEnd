module.exports  = function cookieParserExample2(){

const express = require('express');
const cookieParser = require('cookie-parser');
const PORT = 8080;
const { v4: uuid } = require("uuid");

const app = express();

app.use(cookieParser());

app.get('/', (req, res) => {
    let id;
    const userId = req.cookies["userId"];

    if(userId){
        id = userId;
    } else {
        id = uuid();
        //! 3-t parameter is options --> { httpOnly: true } -> for SECURITY is for blocking the cookie to be accessed by JS scripts --> check browser cookie
        res.cookie("userId", id, { httpOnly: true }); // secured cookie --> s%3ADuqQA27Bn0Sz1O7ARN_mi2R6CjIwNJS9.WQtHDck7f3CyAy1eUg8k86u%2FrrdkSTy5Cye5gJD0E6U
        res.cookie("userId2", id); // not secured cookie --> 9eabf874-6354-4af4-9d5e-5e7ef0923f3c
    }

    res.send("ok, ID: " + id);
})


app.listen(PORT, () => { console.log(`App run on: http://localhost:${PORT}`);});
}