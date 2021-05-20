const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


const uid2 = require("uid2");
const bcrypt = require("bcrypt");

const recipeModel = require('../Models/recipe');
const userModel = require('../Models/users');
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

//route addRecipe  = enregistrer mes recettes
// router.post('/addRecipe',  async (req, res, next)=>{
//   console.log('req.body',req.body)
//   console.log('req.body recipe',req.body.recipeFromFront)


//   let ingredientId = await ingredientsModel.find({name: req.body.nameFromFront});

//   if (!ingredientId) {
//     ingredientId = new ingredientsModel({
//       name: req.body.name,
//     })
//     await ingredientId.save()
//   }

//   console.log('ingredient', ingredientId)

//   const stepList = req.body.stepsFromFront.map((step,i) => {

//   })

//   const newRecipe = new recipeModel({
//     name : req.body.recipeFromFront,

//     steps : stepList,
//     numOfPersons : req.body.numbFromFront,
//     ingredients : [{
//       ingredientId : ingredientId._id,
//       quantity : req.body.quantityFromFront,
//       unit : req.body.unitFromFront
//     }]
//   })

//   await newRecipe.save();
//   console.log('newrecipe', newRecipe)

//   const recipesId = newRecipe._id

//   const response = await userModel.updateOne(
//     {token: req.body.userTokenFromFront},
//     {recipesId}
//   );

//   res.json({result : newRecipe, response, ingredientId})
// })

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
  //Récupérer les ID des ingrédients venant du front
  //Créer les ingrédients qui n'existent pas
  await createIngredientFromListIfNotExist(req.body['ingredients[][name]'])
  // /////////////////////Voir pour chaque ingrédients si ils existent en BDD
  // /////////////////////Créer les ingrédients qui n'existent pas en BDD
  // Récupérer les id de tous les ingrédients
  const ingredientList = [];
  for (const ingredientName of req.body['ingredients[][name]']) {
    console.log('ingredientname', ingredientName)
    const ingredient = await ingredientsModel.findOne({ name: ingredientName });
    ingredientList.push(ingredient)
    console.log('ingredients', ingredientList)
  }
  
  //Créer la recette

  const ingredients = [];
  

    const newRecipe = new recipeModel({
    name : req.body.recipeFromFront,
    steps : req.body['steps[]'],
    numOfPersons : req.body.numbFromFront,
    ingredients : [{
      ingredientId : ingredientList._id,
      quantity : req.body['ingredients[][quantity]'],
      unit : req.body.unitFromFront
    }]
  })
  
    await newRecipe.save();


  res.json({result : newRecipe})
})

//route myRecipes = lire mes recettes
router.get('/myRecipes', (req, res, next) => {
  res.json({ result: myRecipes })
})

//route updateMyRecipe = modifier mes recettes
router.put('/updateMyRecipe', (req, res, next) => {
  res.json({ result: success })
})

//route deleteMyRecipe = supprimer mes recettes
router.delete('/deleteMyRecipe', (req, res, next) => {
  res.json({ result: success })
})

//route newcomment = ajout commentaires
//route comments = lire commentaires
//route updatecomment = modifier commentaire
//route deletecomment = suppression commentaire






module.exports = router;
