const mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

<<<<<<< HEAD
const IngredientModel = require('../Models/ingredients');
const UserModel = require('../Models/users')
=======
const ingredientsModel = require('../Models/ingredients');
const userModel = require('../Models/users')
>>>>>>> d7f2b44f8582883b6affdefea15f898737bd2300

//route myFridge = lire mon frigo
router.get('/myFridge', async (req, res, next)=>{
  console.log('req.body', req.body);

  const user = await UserModel
    .findOne({token: req.body.userTokenFromFront})
    .populate('ingredientsIds')

  res.json({result : user.ingredientsId})
})

//route addToMyFridge = ajouter un ingredient au frigo de l'utilisateur
router.put('/addToMyFridge', async (req, res, next)=>{
  console.log('req.body', req.body);

  // Cherche l'ingrédient en base de donnée
  const ingredient = await IngredientModel.findOne({name: req.body.nameFromFront});

  let response = 'ingredient not found';
  if (ingredient) {
    // Cherche l'utilisateur en base de données
    const user = await UserModel.findOne({token: req.body.userTokenFromFront});
    // Récupère l'array d'ingrédients de l'utilisateur
    const ingredientsIdCopy = user.ingredientsId;
    // Ajoute l'ingrédient à l'array
    ingredientsIdCopy.push(ingredient._id);
    // Update la base de données avec le nouveau tableau (qui possède un nouvel element)
    response = await UserModel.updateOne(
      {token: req.body.userTokenFromFront},
      {ingredientsId: ingredientsIdCopy}
    );
  }


  res.json({result : response})
})

//route deleteFromFridge = supprimer un ingredient
router.delete('/deleteFromFridge', async (req, res, next)=>{
  console.log('req.body', req.body);

  const ingredient = await IngredientModel.findOne({name: req.body.nameFromFront});
  console.log('ingredient', ingredient);
  let response = 'ingredient not found';

  if (ingredient) {
    const user = await UserModel.findOne({token: req.body.userTokenFromFront});

    const newlist = user.ingredientsIds.filter(id => {
      const isDifferentIngredient = id.toString() !== ingredient._id.toString();
      return isDifferentIngredient
    });
    
    response = await UserModel.updateOne(
      {token: req.body.userTokenFromFront},
      {ingredientsId: newlist}
    );
  }

  res.json({result : response})
})

//route créer un nouvelle ingrédients en base de données
router.post('/createIngredient', async (req, res, next)=>{
  console.log('req.body', req.body);

  const newIngredient = new IngredientModel({
    name: req.body.name,
    category: req.body.category
  })

  await newIngredient.save();

  res.json({result : newIngredient})
})

module.exports = router;
