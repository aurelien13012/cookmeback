const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const RecipeModel = require("../Models/recipes");
const UserModel = require("../Models/users");
const IngredientsModel = require("../Models/ingredients");

//route recipeBook = recette suggérée
router.get("/recipeBook", async (req, res, next) => {
  //cherche les recettes en base de donnée
  const recipes = await RecipeModel.find();

  // Cherche l'utilisateur en base de données
  const user = await UserModel.findOne({ token: req.body.userTokenFromFront });
  // Récupère l'array d'ingrédients de l'utilisateur
  const userIngredientsIds = user.ingredientsIds;

  const suggestedRecipes = [];

  recipes.map((recipe) => {
    let recipeIngredients = recipe.ingredients;
      // console.log("recipeIngredients", recipeIngredients);
      // console.log("recipe", recipe);
    let hasIngredients = true;

    recipeIngredients.map((recipeIngredient) => {
      let isFound = false;

      userIngredientsIds.map((userIngredientId) => {
        if (
          recipeIngredient.ingredientsIds.toString() === userIngredientId.toString()
        ) {
          isFound = true;
        }
      });

    if (isFound === false) {
    hasIngredients = false;
      }
    });
  
  if (hasIngredients === true){
    suggestedRecipes.push(recipe._id)
  }
  });

  res.json({suggestedRecipes});
});

//route recipesList = afficher toutes les recettes de la bdd
router.get("/recipesList", async (req, res, next) => {
  const allRecipes = await RecipeModel.find();

  res.json(allRecipes);
});


router.post('/myFavorites', async (req, res, next) => {
  console.log(req.body);

  const user = await UserModel
    .findOne({token: req.body.userTokenFromFront})
    .populate('favoritesIds');

  const favoritesIds = user.favoritesIds;
  console.log('favoritesIds', favoritesIds);

  res.json(favoritesIds)
})

module.exports = router;
