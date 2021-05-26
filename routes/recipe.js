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
    
  const user = await UserModel.findOne({token: req.body.userTokenFromFront});

  res.json({
    recipe: recipe,
    user: user
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

router.put('/updateVote', async (req, res, next) => {
  console.log("req.body", req.body);

  const user = await UserModel.findOne({token: req.body.userTokenFromFront});
  let recipe = await RecipeModel.findById(req.body.idFromFront);

  let likedIds = user.likedIds;
  let dislikedIds = user.dislikedIds;
  let nbVote = recipe.nbVote;
  let nbLike = recipe.nbLike;
  let likedIds2;

  console.log('liked Ids before', likedIds);

  switch (req.body.typeFromFront) {
    case 'like':
      likedIds.push(req.body.idFromFront);
      const isDisliked = dislikedIds.find(id => id.toString() === req.body.idFromFront.toString());
      if (isDisliked) {
        dislikedIds = dislikedIds.filter(id => id.toString() !== req.body.idFromFront.toString());
        nbVote--;
      }
      nbLike++;
      nbVote++;
      break;
    case 'dislike':
      dislikedIds.push(req.body.idFromFront);
      const isLiked = likedIds.find(id => id.toString() === req.body.idFromFront.toString());
      if (isLiked) {
        likedIds = likedIds.filter(id => id.toString() !== req.body.idFromFront.toString());
        nbLike--;
        nbVote--;
      }
      nbVote++;
      break;
    case 'removeLike':
      likedIds = likedIds.filter(id => id.toString() !== req.body.idFromFront.toString());
      nbLike--;
      nbVote--;
      break;
    case 'removeDislike':
      dislikedIds = dislikedIds.filter(id => id.toString() !== req.body.idFromFront.toString());
      nbVote--;
    default:
      break;
  }

  
  console.log('liked Ids after', likedIds);

  await RecipeModel.updateOne({_id: req.body.idFromFront},
    {
      nbVote: nbVote,
      nbLike: nbLike
    });

  await UserModel.updateOne({token: req.body.userTokenFromFront},
    {
      likedIds : likedIds,
      dislikedIds : dislikedIds
    })

  recipe = await RecipeModel
    .findById(req.body.idFromFront)
    .populate("ingredients.ingredientsIds");

  res.json(recipe);
})

module.exports = router;