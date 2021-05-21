const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


const RecipeModel = require('../Models/recipes');
const UserModel = require('../Models/users');
const IngredientsModel = require('../Models/ingredients');

//route recipeBook = recette suggérée
// router.get('/recipeBook', (req, res, next) => {

//   // Cherche l'utilisateur en base de données
//   const user = await UserModel.findOne({token: req.body.userTokenFromFront});
//   console.log('token', user)
//     // Récupère l'array d'ingrédients de l'utilisateur
//   const ingredientsIdCopy = user.ingredientsIds;

//   res.json({})
// })

//route recipesList = afficher toutes les recettes de la bdd
router.get('/recipesList', async (req, res, next) => {
  
  const allRecipes = await RecipeModel.find();

  res.json(allRecipes)
})

module.exports = router;