const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');

// ... other routes ...

router.use(methodOverride('_method'));
const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');

// router logic will go here - will be built later on in the lab

router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find({ owner: req.session.user._id });
    res.render('recipes/index.ejs', { recipes });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

router.get('/new', (req, res) => {
  res.render('recipes/new.ejs');
});

router.post('/', async (req, res) => {
  try {
    const newRecipe = new Recipe({
      ...req.body, // Destructure data from req.body
      owner: req.session.user._id // Assign current user's ID as owner
    });
    await newRecipe.save();
    res.redirect('/recipes'); // Redirect to recipe index
  } catch (error) {
    console.error(error);
    res.redirect('/'); // Redirect back home on error
  }
});


router.get('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId).populate('ingredients'); // Populate ingredients for display
    // Ensure the recipe belongs to the current user
    if (!recipe || recipe.user.toString() !== req.user._id.toString()) {
      return res.status(404).send('Recipe not found');
    }
    res.locals.recipe = recipe;
    res.render('recipes/show.ejs');
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

router.get('/:recipeId/edit', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId).populate('ingredients'); 
    if (!recipe || recipe.user.toString() !== req.user._id.toString()) {
      return res.status(404).send("Recipe not found");
    }
    res.locals.recipe = recipe;
    res.render("recipes/edit");
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

router.delete('/:recipeId', async (req, res) => {
  try {
      const recipe = await Recipe.findById(req.params.recipeId);
      // Ensure the recipe belongs to the current user
      if (!recipe || recipe.user.toString() !== req.user._id.toString()) {
          return res.status(404).send('Recipe not found');
      }
      await Recipe.deleteOne({ _id: req.params.id });
      res.redirect('/recipes');
  } catch (err) {
      console.error(err);
      res.redirect('/');
  }
});



router.put("/:recipeId",async (req,res)=>{
  try{

    const recipe =await Recipe.findById(req.params.recipeId)
    if(!recipe || recipe.user.toString() !== req.user._id.toString()){
      return res.send(404).send("Recipe not found")
    }
    recipe.title = req.body.title
    recipe.ingredients = req.body.ingredients
    recipe.instructions = req.body.instructions

    await recipe.save()
    res.redirect(`/recipes/${recipe._id}`)

  }catch(err){
    console.log(err)
    res.redirect("/")
  }
})

router.post('/', async (req, res) => {
  // ... other logic
  const { ingredients, newIngredient } = req.body;

  // Add existing ingredients
  const ingredientIds = ingredients.map(id => mongoose.Types.ObjectId(id));

  // Add new ingredient (if provided)
  if (newIngredient) {
    const newIngredientDoc = new Ingredient({ name: newIngredient });
    await newIngredientDoc.save();
    ingredientIds.push(newIngredientDoc._id);
  }

  const recipe = new Recipe({
    
    ingredients: ingredientIds,
  });

 
});

module.exports = router;