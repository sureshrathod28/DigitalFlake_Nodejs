let mongoose = require('mongoose')
let postschema = new mongoose.Schema({
    // Category:String,
    // Description:String,
    // Status:String,
    id:String,
    category:String,
    product_name:String,
    pack_size:String,
    mrp:Number,
    status:String,
    user:{type:mongoose.Schema.Types.ObjectId,ref:'userSignUp'}
})

let userCategory = mongoose.model('Category', postschema)
module.exports = userCategory