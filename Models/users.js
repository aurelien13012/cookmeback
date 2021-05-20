const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName : String,
    surName : String,
    email : String,
    password : String,
    token : String,
    recipesIds : [{type: mongoose.Schema.Types.ObjectId, ref : 'recipe'}],
    ingredientsIds : [{type: mongoose.Schema.Types.ObjectId, ref : 'ingredient'}],
    favoritesIds : [{type: mongoose.Schema.Types.ObjectId, ref : 'recipe'}]
});

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;