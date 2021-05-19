const mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

const recipeModel = require('../Models/recipe');
const ingredientModel = require('../Models/ingredient');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// route signup = pour s'inscrire
router.post('/signup',  (req, res, next)=>{
  res.json({result : true})
})

//route signin  = pour se loguer
router.post('/signin',  (req, res, next)=>{
  res.json({result : true})
})

//route myFridge = lire mon frigo
router.get('/myFridge',  (req, res, next)=>{
  res.json({result : ingredient})
})

//route addToMyFridge = ajouter un ingredient
router.put('/addToMyFridge',  (req, res, next)=>{
  res.json({result : ingredient})
})

//route deleteFromFridge = supprimer un ingredient
router.delete('/deleteFromFridge',  (req, res, next)=>{
  res.json({result : ingredient})
})

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
