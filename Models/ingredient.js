const mongoose = require('mongoose');

const ingredientSchema = mongoose.Schema({
    ingredientName : String,
    ingredientCategory : String
});

const ingredientModel = mongoose.model('ingredient', ingredientSchema);

module.exports = ingredientModel;