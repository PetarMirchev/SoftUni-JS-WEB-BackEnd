const mongoose = require('mongoose');
const cors = require("cors");
const express = require('express');
const app = express();


const Dog1 = require('./models/modelSchema');

//****************************************************************************************************** */
// mongoose configuration / mongo DB connection

MONGO_DB_KEY = 'mongodb+srv://XXXXXXX:XXXXXXX@XXXXXXXXX.yyxpxlu.mongodb.net/?retryWrites=true&w=majority';
//mongodb+srv://<user>:<password>@<clustermongodb>.yyxpxlu.mongodb.net/?retryWrites=true&w=majority

const connect = async () => {
    try{
        await mongoose.connect(MONGO_DB_KEY); 
        console.log("MongoDB acc & pass OK!"); 
    } catch(error){
        throw error;
    }  
};

mongoose.connection.on("disconnect", () => {
    console.log("ERROR connect or reconnect to MongoDB!");
});

mongoose.connection.on("connected", () => {
    console.log("mongoDB connected!");
});

mongoose.connection.on('error', (err) => {
    logError(err);
});
//************************************************************************************************* */

app.listen(8800, () => {
    connect();
    console.log("connected to back-end at port:8800 ! -> http://localhost:8800/");
});

//************************************************************************************************ */



//! CREATE
// Variant 1
const newDog1 = new Dog1({ name: "Lil", age: 4, color: "orange" });
newDog1.save();

// Variant 2
const var2 = async () => {
    const newDog2 = await Dog1.create({ name: "Buba4", age: 3, color: "purple" });
    console.log(newDog2);
}
var2();



//! READ
const readData = async () => {
    // return all data from Dog Schema:
    const dogs1 = await Dog1.find({});  // + ".exec();" if is need

    // find all by set criteria -> age: 1
    const dogs2 = await Dog1.find({ age: 1 });

    // find 1 match and return
    const dogs3 = await Dog1.findOne();

    // find 1 match respond to set criteria in {..}
    const dogs4 = await Dog1.findOne({ age: 4 });


    // find by ID criteria:
    const DOG_ID = "651830a70b47d20a5ca068c2";
    const dogs5 = await Dog1.findById(DOG_ID);

    return console.log(dogs5);
}
readData();


//! UPDATE
const updateData = async () => {
    // Option 1 - 
    const DOG_ID = "651830a70b47d20a5ca068c2";
    const dog = await Dog1.findById(DOG_ID);
    dog.age = -3;
    // dog.XXXXX = "......" to modify property
    dog.save();


    // Option 2 - 
    const DOG_ID1 = "651830a70b47d20a5ca068c2";
    await Dog1.findByIdAndUpdate(DOG_ID1, {name: "Test1"});


    // Option 3 - specify object find by Chosen by 1 of his property 
    const updateDataAsObject = await Dog1.updateOne(
        // {name: "TARGET NAME"}, {$set: { age: TO_BE_CHANGED_ON }}
        {name: "Lil"}, { $set: {age: 88} } 
    );
    return updateDataAsObject;
}
updateData();



//! DELETE
const deleteData  =  async () => {
    //Variant 1
    const DOG_ID_X = "6518846fd7987d1343a22ebb";
    await Dog1.findByIdAndRemove(DOG_ID_X);

    //Variant 2
    await Dog1.deleteOne( { name: "NAME_OF_TING"})
}
deleteData();


//************************************************************************************************ */


// FROM THE DB
const DB_DOGS = [
  {
    _id: "6513077a36a392a6dde84a",
    name: "Johny",
    age: 12,
    color: "white",
  },
  {
    _id: "6513077a36a33eea6dde84a",
    name: "Roshko",
    age: 4,
    color: "black",
  },
  {
    _id: "65130136a396eea6dde84a",
    name: "Pesho",
    age: 1,
    color: "brown",
  },
];


// THEN WHEN THEY ARE FETCHED, THEY ARE MAPPED WITH THE SCHEMA
const transformedDbDogs = DB_DOGS.map((dog) => {
  return {
    ...dog,
    getDescription: function () {
      return `This dog is called ${this.name} !`; ;
    },
  };
});

transformedDbDogs.forEach((dog) => console.log(dog.getDescription()));


//************************************************************************************************** */
// middleware lists
app.use(cors());
app.use(express.json());

//************************************************************************************************ */


