const mongoose = require ('mongoose');

const commentSchema = mongoose.Schema({
    userId : [{type: mongoose.Schema.Types.ObjectId, ref : 'user'}],
    comment : String
});

const recipeSchema = mongoose.Schema({
    name : String,
    steps : [String],
    pictures : Buffer,
    numOfPersons : Number,
    rate : Number,
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