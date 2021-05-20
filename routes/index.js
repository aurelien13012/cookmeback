const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const UserModel = require('../Models/users')

const uid2 = require("uid2");
const bcrypt = require("bcrypt");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// route signup = pour s'inscrire
router.post('/signup',  async (req, res, next)=>{

  let error = []
  let result = false
  let saveUser = null
  let token = null

  const data = await UserModel.findOne({
    email: req.body.emailFromFront
  })

  if(data != null){
    error.push('utilisateur déjà présent')
  }

  if(req.body.firstNameFromFront == ''
  || req.body.surNameFromFront == ''
  || req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }


  if(error.length == 0){
    const hash = bcrypt.hashSync(req.body.passwordFromFront, 10);

    let newUser = new UserModel({
      firstName: req.body.firstNameFromFront,
      surName: req.body.surNameFromFront,
      email: req.body.emailFromFront,
      password: hash,
      token : uid2(32),
    })
  
    saveUser = await newUser.save()
  
    
    if(saveUser){
      result = true
      token = saveUser.token
    }
  }

  res.json({result, saveUser, error, token})
})

//route signin  = pour se loguer
router.post('/signin', async (req, res, next)=>{

  let result = false
  let user = null
  let error = []
  let token = null
  
  if(req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }

  if(error.length == 0){
    const user = await UserModel.findOne({
      email: req.body.emailFromFront,
    })
  
    
    if(user){
      if(bcrypt.compareSync(req.body.passwordFromFront, user.password)){
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
  
  res.json({result, user, error, token})
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
router.post('/addRecipe',  (req, res, next)=>{
  res.json({result : success})
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
