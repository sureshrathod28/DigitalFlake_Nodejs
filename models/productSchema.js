let mongoose = require('mongoose')
let postschema = new mongoose.Schema({
    category:String,
    product_name:String,
    pack_size:String,
    mrp:Number,
    image:String,
    status:String,
    user:{type:mongoose.Schema.Types.ObjectId,ref:'userSignUp'}
})

let userpost = mongoose.model('Post', postschema)
module.exports = userpost