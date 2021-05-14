var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useUnifiedTopology : true,
    useNewUrlParser: true,
}

mongoose.connect(process.env.BDD,
    options,
    function(err){
        if(err){
            console.log(err);
        } else {
            console.log('_________BDD OKAY_______')
        }
    }
)

module.exports = mongoose