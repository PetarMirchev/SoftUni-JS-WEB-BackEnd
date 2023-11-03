const Cube = require('../models/Cube')
const cubes = [];


exports.create = async (cubeData) => { 
    const cube = new Cube(cubeData); // create Cube from Schema
    await cube.save();
  
    //variant 2 to save data:
    // const cube = new Cube.create(cubeData);
};


exports.getAll = async (search, form, to) => {
    let filterCubes = await Cube.find().lean();


    if(search) {
        filterCubes = filterCubes.filter((cube) => cube.name.toLowerCase().includes(search.toLowerCase()));
    }

    if(form){
        filterCubes = filterCubes.filter((cube) => cube.difficultyLevel >= Number(from));
    }

    if(to){
        filterCubes = filterCubes.filter((cube) => cube.difficultyLevel <= Number(to));
    }

    return filterCubes;
};


exports.getSingleCube = (id) => {
    return Cube.findById(id).populate("accessories");
};


exports.attachAccessory = async (cubeId, accessoryIDs) => {
    const cube = await this.getSingleCube(cubeId);
    cube.accessories.push(accessoryIDs);
    return cube.save();
};