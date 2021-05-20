const mongoose = require('mongoose');

const ingredientSchema = mongoose.Schema({
    name : String,
    category : String
});

const IngredientModel = mongoose.model('ingredients', ingredientSchema);

module.exports = IngredientModel;