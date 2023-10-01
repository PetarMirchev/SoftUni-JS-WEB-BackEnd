const Cube = require('../models/Cube')
const cubes = [];


exports.create = async (cubeData) => { 
    const cube = new Cube(cubeData); // create Cube from Schema
    await cube.save();
  
    //variant 2 to save data:
    // const cube = new Cube.create(cubeData);
};


exports.getAll = (search, form, to) => {
    let filterCubes = [...cubes];

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
    return cubes.find( (cube) => cube.id === id);
};