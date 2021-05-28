const mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

const UserModel = require('../Models/users')

const uid2 = require("uid2");
const bcrypt = require("bcrypt");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// route signup = pour s'inscrire
router.post('/signup',  async (req, res, next)=>{

  let error = []
  let result = false
  let saveUser = null
  let token = null

  //récupère l'émail 
  const data = await UserModel.findOne({
    email: req.body.emailFromFront
  })

  //si email déja présent message d'erreur
  if(data != null){
    error.push('utilisateur déjà présent')
  }

  //si au moins un champs vide message d'erreur
  if(req.body.firstNameFromFront == ''
  || req.body.surnameFromFront == ''
  || req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }

  //si formulaire bien rempli enregistre les données hash le MDP et créer un token
  if(error.length == 0){
    const hash = bcrypt.hashSync(req.body.passwordFromFront, 10);

    let newUser = new UserModel({
      firstName: req.body.firstNameFromFront,
      surname: req.body.surnameFromFront,
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
  
  //vérifie que les champs ne sont pas vide sinon message d'erreur
  if(req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }

  //si aucune erreur récupère l'email
  if(error.length == 0){
    const user = await UserModel.findOne({
      email: req.body.emailFromFront,
    })
  
    //vérifie le mot de passe si MDP faux envoi message d'erreur
    if(user){
      if(bcrypt.compareSync(req.body.passwordFromFront, user.password)){
        result = true
        token = user.token
      } else {
        result = false
        error.push('mot de passe incorrect')
      }
  
  //si l'email ne correspond pas a un email de la BDD msg d'erreur
  } else {
    error.push('email incorrect')
  }
  }
  
  res.json({result, user, error, token})
})

module.exports = router;
