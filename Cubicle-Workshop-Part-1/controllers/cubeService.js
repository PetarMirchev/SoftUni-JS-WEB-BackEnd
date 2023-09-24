const uniqid = require('uniqid');
const cubes = [];


exports.create = (cubeData) => { 
    debugger
    const newCube = {
        id: uniqid(),
        ...cubeData,
       
    };
    //console.log(cubeData);

    cubes.push(newCube);
    return newCube;
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