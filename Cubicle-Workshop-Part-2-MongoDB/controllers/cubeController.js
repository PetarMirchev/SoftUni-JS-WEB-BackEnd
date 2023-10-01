const router = require("express").Router();
const cubeService = require("./cubeService");


router.get('/create', (req, res) => {
    res.render('create');
});


 router.post("/create", async (req, res) => {
    // get data from form & split it 
    const { name, description, imageUrl, difficultyLevel } = req.body;
  
    await cubeService.create({
      name,
      description,
      imageUrl,
      difficultyLevel: Number(difficultyLevel),
    });
    res.redirect("/");
  });



router.get('/:cubeId/details', (req, res) => {
    const {cubeId} = req.params;
    const cube = cubeService.getSingleCube(cubeId);

    if(!cube){
        res/redirect('/404');
    }

    res.render('details', {...cube}); // important dont use '/details' throw error!
});

module.exports = router;