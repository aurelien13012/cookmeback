const mongoose = require ('mongoose');

const commentsSchema = mongoose.Schema({
    userId : [{type: mongoose.Schema.Types.ObjectId, ref : 'user'}],
    comment : String
});

const recipeSchema = mongoose.Schema({
    name : String,
    steps : String,
    pictures : Buffer,
    numOfPersons : Number,
    rate : Number,
    likeState : Boolean,
    ingredientsId : [{type: mongoose.Schema.Types.ObjectId, ref : 'ingredient'}],
    comment: commentsSchema
});

const recipeModel = mongooseModel('recipe', recipeSchema);