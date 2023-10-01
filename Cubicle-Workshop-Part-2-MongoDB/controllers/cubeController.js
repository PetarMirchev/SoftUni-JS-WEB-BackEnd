const router = require("express").Router();
const cubeService = require("./cubeService");
const accessoryService = require("./accessoryService");


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



router.get('/:cubeId/details', async (req, res) => {
    const {cubeId} = req.params;
    const cube = await cubeService.getSingleCube(cubeId).lean();

    if(!cube){
        res.redirect('/404');
        return;
    }

    const hasAccessories = cube.accessories?.length > 0;
    res.render('details', {...cube, hasAccessories}); // important dont use '/details' throw error!
});

//************************************************************************************************** */

// accessory attachement
router.get("/:cubeId/attach-accessory", async (req, res) => {

  const {cubeId} = req.params;
  const cube = await cubeService.getSingleCube(cubeId).lean();

  const accessories = await accessoryService.getWithoutOwned(cube.accessories).lean();
  
  const hasAccessories = accessories.length > 0;

  res.render('accessory/attach', {cube, accessories, hasAccessories});
});



router.post("/:cubeId/attach-accessory", async (req, res) => {
  const {cubeId} = req.params;
  const {accessory: accessoryIDs} = req.body;

  await cubeService.attachAccessory(cubeId, accessoryIDs);
  res.redirect(`/cubes/${cubeId}/details`);
});

//***************************************************************************************** */

module.exports = router;