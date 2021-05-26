const mongoose = require ('mongoose');

const commentSchema = mongoose.Schema({
    userId : [{type: mongoose.Schema.Types.ObjectId, ref : 'user'}],
    comment : String
});

const recipeSchema = mongoose.Schema({
    name : String,
    steps : [String],
    pictures : String,
    numOfPersons : Number,
    nbLike : Number,
    nbVote: Number,
    likeState : Boolean,
    ingredients : [{
      ingredientsIds: {type: mongoose.Schema.Types.ObjectId, ref : 'ingredients'},
      quantity: Number,
      unit: String
    }],
    comments: commentSchema
});

const RecipeModel = mongoose.model('recipes', recipeSchema);

module.exports = RecipeModel;