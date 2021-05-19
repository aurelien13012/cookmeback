const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userName : String,
    lastName : String,
    firstName : String,
    email : String,
    password : String,
    token : String,
    recipesId : [{type: mongoose.Schema.Types.ObjectId, ref : 'recipe'}],
    ingredientsId : [{type: mongoose.Schema.Types.ObjectId, ref : 'ingredient'}],
    favoritesId : [{type: mongoose.Schema.Types.ObjectId, ref : 'recipe'}]
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;