
module.exports  =  function jwtCallback(){

    const express = require("express");
    const cookieParser = require("cookie-parser");
    const jwt = require("jsonwebtoken");
    const bcrypt = require("bcrypt");
    const PORT = 8080;
    const app = express();


    app.use(cookieParser());
    app.use(express.urlencoded({ extended: false }));

    const users = {};
    const SECRET = "MySecretShhhhhh...";

    app.get("/", (req, res) => {
        const payload = { id: 123, username: "Pepi", age: 28};
        const secret = "MySecretShhhhhh...";
        // set options for example expires after 3days 
        const options = { expiresIn: "3d"};

                        //JWT have  3 parameters 
        const token = jwt.sign(payload, secret, options);
        res.send(token);
    });



    app.get('/verification/:token', (req, res) => {
        const { token } = req.params;

        const result = jwt.verify(token, "MySecretShhhhhh...");
        console.log({result});
        res.send("Ok pass!");
    });



    //********************************************************************************* */

    app.get('/login', (req, res) => {
        res.send(`
          <h3>Login </h3>
            <form method="post">
              <label for="username">Username</label>
              <input type="text" name="username" />
              <label for="password">Password</label>
              <input type="password" name="password" />
              <input type="submit" value="Submit" />
            </form>`);
    });
//************************************************************************************************ */

 //! ---> ********************************************************************************   
    app.post('/login', async (req, res) => {
        const { username, password } = req.body;
        const preservedHash = users[username]?.password;

        //                      removes the salt and compares pure hashes
        const isValid = await bcrypt.compare(password, preservedHash);

//!!!!!!!! ------------------------- !!!!!!!!!!!!!!!!!!!!!!!!!!!!
        if(isValid) {
            //res.status(200).send("Successfully logged in!");
            const payload = {username};
            jwt.sign(payload, SECRET, (err, token) => {
                if(err) {
                    return res.redirect("/404");
                }

                // Set jwt as cookie
                res.cookie("token", token);
                res.redirect("/profile");
            });
        } else {
            res.status(401).send("Invalid username or password!");
        }
    });

//*************************************************************************************************** */

    app.get("/register", (req, res) => {
        res.send(`
                <h3>Register </h3>
                  <form method="post">
                    <label for="username">Username</label>
                    <input type="text" name="username" />
                    <label for="password">Password</label>
                    <input type="password" name="password" />
                    <input type="submit" value="Submit" />
                  </form>`);
      });

    app.post("/register", async (req, res) => {
        const { username, password } = req.body;

        //if you put big number in 'genSalt(X)' time for generate & respond will be slow, but pass will be more strong
        const salt = await bcrypt.genSalt(10);
        //Hash the password /encrypt/  + add salt to be mix before put in DB
        const hash = await bcrypt.hash(password, salt);
        
        users[username] = {password: hash};
        const x = users[username] = {password: hash};
        console.log({x}); // x {password: '$2b$10$5ukXQEOj42N.Atk03oqTX.SKe96FXm8Ra87duFYK5XLrPjLYwuaH.'} 

        res.redirect('/login');
    });


//************************************************************************************************* */
    app.get('/profile', (req, res) => {
        const token = req.cookies["token"];
        console.log({token});

        if (token){
            jwt.verify(token, SECRET, (err, payload) => {
                if(err){
                    return res.status(401).send("Unauthorized!");
                } 

                return res.send(`Profile: ${payload.username}`)     
            });
        } else {
            return res.redirect("/login")
        }
    });

//************************************************************************************************* */


    app.listen(PORT, () => { console.log(`App run on: http://localhost:${PORT}`);});
}