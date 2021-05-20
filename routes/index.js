const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const recipeModel = require('../Models/recipes');
const ingredientModel = require('../Models/ingredients');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//route recipeFromApi = renvoi des recette de l'api
router.get('/recipesFromApi',  (req, res, next)=>{
  res.json({result : recipes})
})

//route addFav = ajout d'une recette en favorite
router.get('/addFav',  (req, res, next)=>{
  res.json({result : favorite})
})

//route favoriteRecipes = lecture recette favorite
router.get('/favoriteRecipes',  (req, res, next)=>{
  res.json({result : favorite})
})

//route deleteFav = suppression d'une recette favorite
router.delete('/deleteFav',  (req, res, next)=>{
  res.json({result : favorite})
})

//route addRecipe  = enregistrer mes recettes
router.post('/addRecipe',  async (req, res, next)=>{



  const newRecipe = new recipeModel({
    name : req.body.recipeFromFront,
    steps : req.body.stepsFromFront,
    pictures : req.body.pictureFromFront,
    numOfPersons : req.body.numbFromFront,
    // ingredients : //mettre variable
  })

  await newRecipe.save();

  res.json({result : true})
})

//route myRecipes = lire mes recettes
router.get('/myRecipes',  (req, res, next)=>{
  res.json({result : myRecipes})
})

//route updateMyRecipe = modifier mes recettes
router.put('/updateMyRecipe',  (req, res, next)=>{
  res.json({result : success})
})

//route deleteMyRecipe = supprimer mes recettes
router.delete('/deleteMyRecipe',  (req, res, next)=>{
  res.json({result : success})
})

//route newcomment = ajout commentaires
//route comments = lire commentaires
//route updatecomment = modifier commentaire
//route deletecomment = suppression commentaire






module.exports = router;
