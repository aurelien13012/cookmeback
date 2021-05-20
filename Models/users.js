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

<<<<<<< HEAD
const UserModel = mongoose.model('users', userSchema);
=======
const UserModel = mongoose.model('user', userSchema);
>>>>>>> d7f2b44f8582883b6affdefea15f898737bd2300

module.exports = UserModel;