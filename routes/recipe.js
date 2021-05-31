///// IMPORT
var express = require('express');
var router = express.Router();
// Import modèles
const RecipeModel = require('../Models/recipes');
const UserModel = require('../Models/users');

// Route pour récupérer les data d'une recette et d'un user
router.post('/readRecipe', async (req, res, next) => {
  // console.log("req.body", req.body);

  // Populate pour récupérer le nom des ingrédients
  const recipe = await RecipeModel
    .findById(req.body.idFromFront)
    .populate("ingredients.ingredientsIds")
    
  const user = await UserModel.findOne({token: req.body.userTokenFromFront});

  res.json({
    recipe: recipe,
    user: user
  })
})

// Route pour ajouter une recette aux favoris
router.post('/addToFavorites', async (req, res, next) => {
  // Récupération du user
  const user = await UserModel.findOne({token: req.body.userTokenFromFront});
  // On push l'id de la recette dans son array de recettes faovrites 
  user.favoritesIds.push(req.body.idFromFront);
  
  // On update avec le nouvel array
  await UserModel.updateOne(
    {token: req.body.userTokenFromFront},
    {favoritesIds: user.favoritesIds}
  )

  res.json();
})

// Route pour supprimer une recette des faovris (similaire à /addToFavorites)
router.delete('/removeFromFavorites', async (req, res, next) => {

  const user = await UserModel.findOne({token: req.body.userTokenFromFront});

  // On assigne à une variable l'array favorites Ids duquel on a enlevé l'id de la recette  
  const updatedFavoritesIds = user.favoritesIds.filter(id => req.body.idFromFront.toString() !== id.toString());
  
  await UserModel.updateOne(
    {token: req.body.userTokenFromFront},
    {favoritesIds: updatedFavoritesIds}
  )

  res.json();
})

// Route pour updater les like et les votes (dont est déduit la note)
router.put('/updateVote', async (req, res, next) => {

  // On récupère la recette et le user
  const user = await UserModel.findOne({token: req.body.userTokenFromFront});
  let recipe = await RecipeModel.findById(req.body.idFromFront);

  // On sotck dans des variables les données utiles pour une meilleur lisiblité
  let likedIds = user.likedIds;
  let dislikedIds = user.dislikedIds;
  let nbVote = recipe.nbVote;
  let nbLike = recipe.nbLike;

  /// INFO GENERALE : 
  // Liker une recette = Ajouter un like et ajouter un vote
  // Disliké une recette = Juste ajouter un vote
  // note = like/vote

  // La route attends un "type" de requete de la part du front
  switch (req.body.typeFromFront) {
    case 'like': //Ajoute un like
      // On ajoute l'id de la recette à l'array des recettes likées
      likedIds.push(req.body.idFromFront);
      // True si la recette est actuellement disliké par le user
      const isDisliked = dislikedIds.find(id => id.toString() === req.body.idFromFront.toString());
      if (isDisliked) { // Si disliké
        // On enlève la recette de l'array des recettes dislikées
        dislikedIds = dislikedIds.filter(id => id.toString() !== req.body.idFromFront.toString());
        // on retire le vote du dislike
        nbVote--;
      }
      // On ajoute un like et un vote
      nbLike++;
      nbVote++;
      break;
    case 'dislike': // Ajoute un dislike
      // On ajoute l'id aux recettes likées
      dislikedIds.push(req.body.idFromFront);
      // True si la recette est actuellement likée
      const isLiked = likedIds.find(id => id.toString() === req.body.idFromFront.toString());
      if (isLiked) { // Si likée
        // On retire l'id des recettes likées
        likedIds = likedIds.filter(id => id.toString() !== req.body.idFromFront.toString());
        // on enlève le vote et le like
        nbLike--;
        nbVote--;
      }
      // On ajoute juste un vote pour un dislike
      nbVote++;
      break;
    case 'removeLike': // On elève le like
      // On retire l'id des recettes likées
      likedIds = likedIds.filter(id => id.toString() !== req.body.idFromFront.toString());
      // On enlève le vote et le like
      nbLike--;
      nbVote--;
      break;
    case 'removeDislike': // On enlève le dislike
      // On retire l'id des recettes dislikées
      dislikedIds = dislikedIds.filter(id => id.toString() !== req.body.idFromFront.toString());
      // On enlève le dislike (juste un vote)
      nbVote--;
    default:
      break;
  }

  // On update la recette avec les votes et les likes
  await RecipeModel.updateOne({_id: req.body.idFromFront},
    {
      nbVote: nbVote,
      nbLike: nbLike
    });

  // On update le luser avec ses recettes likées et dislikées
  await UserModel.updateOne({token: req.body.userTokenFromFront},
    {
      likedIds : likedIds,
      dislikedIds : dislikedIds
    })
  
  // On récupère la recette updatée
  recipe = await RecipeModel
    .findById(req.body.idFromFront)
    .populate("ingredients.ingredientsIds");
  
  // On renvoie la recette au front
  res.json(recipe);
})

module.exports = router;