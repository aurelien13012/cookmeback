const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName : String,
    surName : String,
    email : String,
    password : String,
    token : String,
    recipesIds : [{type: mongoose.Schema.Types.ObjectId, ref : 'recipes'}],
    ingredientsIds : [{type: mongoose.Schema.Types.ObjectId, ref : 'ingredients'}],
    favoritesIds : [{type: mongoose.Schema.Types.ObjectId, ref : 'recipes'}]
});

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;