const mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

const RecipeModel = require('../Models/recipes');
const UserModel = require('../Models/users');

router.post('/readRecipe', async (req, res, next) => {
  console.log("req.body", req.body);

  const recipe = await RecipeModel
    .findById(req.body.idFromFront)
    .populate("ingredients.ingredientsIds")
    
  
  // const test = await recipe.ingredients.populate('ingredientsIds')

  res.json({
    response: recipe,
    // test: test
  })
})

router.post('/addToFavorites', async (req, res, next) => {
  console.log("req.body", req.body);

  const user = await UserModel.findOne({token: req.body.userTokenFromFront});

  user.favoritesIds.push(req.body.idFromFront);
  
  await UserModel.updateOne(
    {token: req.body.userTokenFromFront},
    {favoritesIds: user.favoritesIds}
  )

  res.json();
})

router.delete('/removeFromFavorites', async (req, res, next) => {
  console.log("req.body", req.body);

  const user = await UserModel.findOne({token: req.body.userTokenFromFront});

  const updatedFavoritesIds = user.favoritesIds.filter(id => req.body.idFromFront.toString() !== id.toString());
  
  await UserModel.updateOne(
    {token: req.body.userTokenFromFront},
    {favoritesIds: updatedFavoritesIds}
  )

  res.json();
})

module.exports = router;