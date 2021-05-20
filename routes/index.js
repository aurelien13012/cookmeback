const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


const uid2 = require("uid2");
const bcrypt = require("bcrypt");

const recipeModel = require('../Models/recipe');
const UserModel = require('../Models/users');
const ingredientsModel = require('../Models/ingredients');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// route signup = pour s'inscrire
router.post('/signup', async (req, res, next) => {

  let error = []
  let result = false
  let saveUser = null
  let token = null

  const data = await userModel.findOne({
    email: req.body.emailFromFront
  })

  if (data != null) {
    error.push('utilisateur déjà présent')
  }

  if (req.body.firstNameFromFront == ''
    || req.body.surNameFromFront == ''
    || req.body.emailFromFront == ''
    || req.body.passwordFromFront == ''
  ) {
    error.push('champs vides')
  }


  if (error.length == 0) {
    const hash = bcrypt.hashSync(req.body.passwordFromFront, 10);

    let newUser = new userModel({
      firstName: req.body.firstNameFromFront,
      surName: req.body.surNameFromFront,
      email: req.body.emailFromFront,
      password: hash,
      token: uid2(32),
    })

    saveUser = await newUser.save()


    if (saveUser) {
      result = true
      token = saveUser.token
    }
  }

  res.json({ result, saveUser, error, token })
})

//route signin  = pour se loguer
router.post('/signin', async (req, res, next) => {

  let result = false
  let user = null
  let error = []
  let token = null

  if (req.body.emailFromFront == ''
    || req.body.passwordFromFront == ''
  ) {
    error.push('champs vides')
  }

  if (error.length == 0) {
    const user = await userModel.findOne({
      email: req.body.emailFromFront,
    })


    if (user) {
      if (bcrypt.compareSync(req.body.passwordFromFront, user.password)) {
        result = true
        token = user.token
      } else {
        result = false
        error.push('mot de passe incorrect')
      }

    } else {
      error.push('email incorrect')
    }
  }

  res.json({ result, user, error, token })
})

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
  console.log('req.body', req.body)

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
      name: ingredientName,
      quantity: req.body['ingredients[][quantity]'][i],
      unit: req.body['ingredients[][unit]'][i]
    }
  })

  console.log('ingredients', ingredients)

  const newRecipe = new recipeModel({
    name: req.body.recipeFromFront,
    steps: req.body['steps[]'],
    numOfPersons: req.body.numbFromFront,
    ingredients: ingredients
  })

  await newRecipe.save();
  console.log('newRecipe', newRecipe)

  const recipeId = newRecipe._id
  console.log(recipeId)

  await UserModel.updateOne(
    { token: req.body.userTokenFromFront },
    { recipesIds: recipeId }
  );


  res.json({ result: newRecipe })
})

//route myRecipes = lire mes recettes
router.get('/myRecipes', async (req, res, next) => {

  const recipes =
    await UserModel.findOne({ token: req.query.tokenFromFront })
      .populate('recipesIds')

  res.json(recipes)
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
      name: ingredientName,
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


  res.json({result : true})
})

//route deleteMyRecipe = supprimer mes recettes
router.delete('/deleteMyRecipe/:idFromFront', async (req, res, next) => {

  const response = await recipeModel.deleteOne({_id: req.params.idFromFront })
  

  res.json({ result: response })
})

//route newcomment = ajout commentaires
//route comments = lire commentaires
//route updatecomment = modifier commentaire
//route deletecomment = suppression commentaire






module.exports = router;
