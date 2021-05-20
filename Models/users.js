const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName : String,
    surName : String,
    email : String,
    password : String,
    token : String,
    recipesId : [{type: mongoose.Schema.Types.ObjectId, ref : 'recipe'}],
    ingredientsId : [{type: mongoose.Schema.Types.ObjectId, ref : 'ingredient'}],
    favoritesId : [{type: mongoose.Schema.Types.ObjectId, ref : 'recipe'}]
});

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;