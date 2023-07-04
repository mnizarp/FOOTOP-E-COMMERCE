const mongoose=require('mongoose')

const wishlistSchema=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    product_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product',
        required:true
    }
})


const collection= mongoose.model('wishlist',wishlistSchema)

module.exports=collection