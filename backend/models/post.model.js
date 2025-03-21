const {model,Schema} = require('mongoose')

const postSchema = new Schema({
    title : {
        type : String,
        required : true,
        trim : true
        
    },
    content : {
        type : String,
        required : true,
        trim : true
    },
    file: String,
    tags: { type: [String], default: [] }
})

const Post = model('Post', postSchema);

// Export the model
module.exports = Post;