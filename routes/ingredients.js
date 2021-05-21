const mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

const IngredientModel = require('../Models/ingredients');
const UserModel = require('../Models/users')

// route lire tous les ingrédients de la base de données
router.get('/allIngredients', async (req, res, next) => {
  
  const allIngredients = await IngredientModel.find();

  const dataReturned = allIngredients.filter(ingredient => {
    return ingredient.category
  })

  res.json(dataReturned)
})

//route myFridge = lire mon frigo
router.post('/myFridge', async (req, res, next)=>{
  console.log('req.body', req.body);

  const user = await UserModel
    .findOne({token: req.body.userTokenFromFront})
    .populate('ingredientsIds')

  res.json(user.ingredientsIds)
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
    const ingredientsIdCopy = user.ingredientsIds;
    // Ajoute l'ingrédient à l'array
    ingredientsIdCopy.push(ingredient._id);
    // Update la base de données avec le nouveau tableau (qui possède un nouvel element)
    response = await UserModel.updateOne(
      {token: req.body.userTokenFromFront},
      {ingredientsIds: ingredientsIdCopy}
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
      {ingredientsIds: newlist}
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
