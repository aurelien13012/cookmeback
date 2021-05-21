const mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

var RecipeModel = require('../Models/recipes')

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

module.exports = router;