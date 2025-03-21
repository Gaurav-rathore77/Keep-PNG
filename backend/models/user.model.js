const {model , Schema} = require('mongoose')

const userSchema = new Schema({
    username : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        trim : true
    },
    // role : {
    //     type : String,
    //     enum : ['user' , 'admin'],
    //     default : 'user'
    // },
    
})

const User = model('User', userSchema);

// Export the model
module.exports = User;