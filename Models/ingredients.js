const mongoose = require('mongoose');

const ingredientsSchema = mongoose.Schema({
    name : String,
    category : String
});

const ingredientsModel = mongoose.model('ingredients', ingredientsSchema);

module.exports = ingredientsModel;