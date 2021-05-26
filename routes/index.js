const mongoose = require('mongoose');
const uniqid = require('uniqid');
const fs = require('fs');
const express = require('express');
const router = express.Router();


const recipeModel = require('../Models/recipes');
const UserModel = require('../Models/users');
const ingredientsModel = require('../Models/ingredients');


const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


//route recipeFromApi = renvoi des recette de l'api
router.get('/recipesFromApi', (req, res, next) => {
  res.json({ result: recipes })
})

//route addFav = ajout d'une recette en favorite
router.get('/addFav', (req, res, next) => {
  res.json({ result: favorite })
})

//route favoriteRecipes = lecture recette favorite
router.get('/favoriteRecipes', (req, res, next) => {
  res.json({ result: favorite })
})

//route deleteFav = suppression d'une recette favorite
router.delete('/deleteFav', (req, res, next) => {
  res.json({ result: favorite })
})

const createIngredientFromListIfNotExist = async (ingredientNames) => {
  // console.log('ingredientname', ingredientNames)

  for (const ingredientName of ingredientNames) {
    let ingredientFind = await ingredientsModel.findOne({ name: ingredientName })
    if (!ingredientFind) {
      ingredientId = new ingredientsModel({
        name: ingredientName,
      })
      await ingredientId.save()
    }
  }
}

router.post('/addRecipe', async (req, res, next) => {
  // console.log('req', req)
  // console.log('req.body', req.body)
  // console.log('recipeName', req.body.recipeFromFront)
  // console.log('req.bodyingredientsname', req.body['ingredients[][name]'])
  // console.log('picture', req.body.pictureFromFront)
  // console.log('files', req.files)

  const bodyIngredients = JSON.parse(req.body.ingredients)
  let ingredientNames = bodyIngredients.map((ing) => ing.name)
  let ingredientQuantities = bodyIngredients.map((ing) => ing.quantity)
  let ingredientUnits = bodyIngredients.map((ing) => ing.unit)
  let ingredientSteps = JSON.parse(req.body.steps)

  // console.log('bodyIngredients', bodyIngredients)
  // console.log('ingredientNames', ingredientNames)
  // console.log('ingredientQte', ingredientQuantities)
  // console.log('ingredientUnits', ingredientUnits)

  await createIngredientFromListIfNotExist(ingredientNames)

  const ingredientList = [];
  for (const ingredientName of ingredientNames) {
    console.log('ingredientname', ingredientName)
    const ingredient = await ingredientsModel.findOne({ name: ingredientName });
    ingredientList.push(ingredient)
    console.log('ingredients', ingredientList)
  }

  const ingredients = ingredientNames.map((ingredientName, i) => {
    console.log('ingredient', ingredientName)
    console.log('i', i)
    return {
      ingredientsIds: ingredientList[i]._id,
      quantity: ingredientQuantities[i],
      unit: ingredientUnits[i]
    }
  })

  console.log('ingredients', ingredients)

  let pictureName;
  let resultCloudinary;
  console.log("reqFiles", req.files);
  if (req.files) {
    pictureName = 'tmp/' + uniqid() + '.jpg';
    let resultPicture = await req.files.food.mv(pictureName);
    if (!resultPicture) {
      resultCloudinary = await cloudinary.uploader.upload(pictureName)
      console.log('cloudi', resultCloudinary.url)
      const newRecipe = new recipeModel({
        name: req.body.recipeFromFront,
        steps: ingredientSteps,
        numOfPersons: req.body.numbFromFront,
        ingredients: ingredients,
        pictures: resultCloudinary.url,
        nbLike: 0,
        nbVote: 0
      })

      await newRecipe.save();
      console.log('newRecipe', newRecipe)

      const recipeId = newRecipe._id
      console.log(recipeId)

      const user = await UserModel.findOne({ token: req.body.userTokenFromFront })

      const userRecipes = user.recipesIds

      userRecipes.push(recipeId)

      await UserModel.updateOne(
        { token: req.body.userTokenFromFront },
        { recipesIds: userRecipes }
      );

      res.json(recipeId)

      fs.unlinkSync(pictureName);
    }

  } else {
    console.log("in else");
    const newRecipe = new recipeModel({
      name: req.body.recipeFromFront,
      steps: ingredientSteps,
      numOfPersons: req.body.numbFromFront,
      ingredients: ingredients,
    })
    await newRecipe.save();
    console.log('newRecipe', newRecipe)

    const recipeId = newRecipe._id
    console.log('recipeID', recipeId)

    const user = await UserModel.findOne({ token: req.body.userTokenFromFront })

    const userRecipes = user.recipesIds

    userRecipes.push(recipeId)

    await UserModel.updateOne(
      { token: req.body.userTokenFromFront },
      { recipesIds: userRecipes }
    );


    res.json(recipeId)
  }

})

//route myRecipes = lire mes recettes
router.get('/myRecipes', async (req, res, next) => {

  const recipes =
    await UserModel.findOne({ token: req.query.tokenFromFront })
      .populate('recipesIds')

  console.log('recipes', recipes)
  console.log('recipesId', recipes.recipesIds)
  console.log('recipesId', recipes.recipesIds._id)

  res.json(recipes.recipesIds)
})

//route updateMyRecipe = modifier mes recettes
router.put('/updateMyRecipe', async (req, res, next) => {
  console.log('query', req.query)
  console.log('body', req.body)

  const recipe = await recipeModel.findOne({ _id: req.body.idFromFront })
  console.log('recipe', recipe)

  await createIngredientFromListIfNotExist(req.body['ingredients[][name]'])

  const ingredientList = [];
  for (const ingredientName of req.body['ingredients[][name]']) {
    console.log('ingredientname', ingredientName)
    const ingredient = await ingredientsModel.findOne({ name: ingredientName });
    ingredientList.push(ingredient)
    console.log('ingredients', ingredientList)
  }

  const ingredients = req.body['ingredients[][name]'].map((ingredientName, i) => {
    console.log('ingredient', ingredientName)
    console.log('i', i)
    return {
      ingredientsIds: ingredientList[i]._id,
      quantity: req.body['ingredients[][quantity]'][i],
      unit: req.body['ingredients[][unit]'][i]
    }
  })

  await recipe.updateOne({
    name: req.body.recipeFromFront,
    steps: req.body['steps[]'],
    numOfPersons: req.body.numbFromFront,
    ingredients: ingredients
  })


  res.json({ result: true })
})

//route deleteMyRecipe = supprimer mes recettes
router.delete('/deleteMyRecipe/:idFromFront', async (req, res, next) => {

  const response = await recipeModel.deleteOne({ _id: req.params.idFromFront })


  res.json({ result: response })
})

//route newcomment = ajout commentaires
//route comments = lire commentaires
//route updatecomment = modifier commentaire
//route deletecomment = suppression commentaire






module.exports = router;
