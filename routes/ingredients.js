const mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

const ingredientsModel = require('../Models/ingredients');
const userModel = require('../Models/user')

//route myFridge = lire mon frigo
router.get('/myFridge',  (req, res, next)=>{
  res.json({result : ingredient})
})

//route addToMyFridge = ajouter un ingredient
router.put('/addToMyFridge', async (req, res, next)=>{
  console.log('req.body', req.body);

  const ingredient = await ingredientsModel.findOne({name: req.body.nameFromFront});

  const user = await userModel.findOne({token: req.body.userTokenFromFront});
  
  const ingredientsId = user.ingredientsId;

  ingredientsId.push(ingredient._id);
  
  const response = await userModel.updateOne(
    {token: req.body.userTokenFromFront},
    {ingredientsId: ingredientsId}
  );

  res.json({result : response})
})

//route deleteFromFridge = supprimer un ingredient
router.delete('/deleteFromFridge', async (req, res, next)=>{
  console.log('req.body', req.body);

  const ingredient = await ingredientsModel.findOne({name: req.body.nameFromFront});

  const user = await userModel.findOne({token: req.body.userTokenFromFront});
  
  const ingredientsId = user1.ingredientsId;

  ingredientsId.push(ingredient._id);
  
  const response = await userModel.updateOne(
    {token: req.body.userTokenFromFront},
    {ingredientsId: ingredientsId}
  );

  res.json({result : response})
})

//route créer un nouvelle ingrédients en base de données
router.post('/createIngredient', async (req, res, next)=>{
  console.log('req.body', req.body);

  const newIngredient = new ingredientsModel({
    name: req.body.name,
    category: req.body.category
  })

  await newIngredient.save();

  res.json({result : newIngredient})
})

module.exports = router;
