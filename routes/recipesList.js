const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const RecipeModel = require("../Models/recipes");
const UserModel = require("../Models/users");

//route recipeBook = recette suggérée
router.post("/recipeBook", async (req, res, next) => {
  //cherche les recettes en base de donnée
  const recipes = await RecipeModel.find();
  // Cherche l'utilisateur en base de données
  const user = await UserModel.findOne({ token: req.body.userTokenFromFront });
  // Récupère l'array d'ingrédients de l'utilisateur
  const userIngredientsIds = user.ingredientsIds;
  // console.log("userIngredientsIds", userIngredientsIds);
  // console.log("userIngredientsIds.length", userIngredientsIds.length);
  const suggestedRecipes = [];

  recipes.forEach((recipe) => {
    let recipeIngredients = recipe.ingredients;
      console.log("recipeIngredients", recipeIngredients);
      //console.log("recipe", recipe);
    let hasIngredients = true;

    recipeIngredients.forEach((recipeIngredient) => {
      let isFound = false;

      userIngredientsIds.forEach((userIngredientId) => {
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

  const suggestedRecipe = await RecipeModel.findById(suggestedRecipes[0])
  console.log("result",suggestedRecipe);
  console.log("suggestedRecipes",suggestedRecipes);
  res.json({suggestedRecipe});
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
