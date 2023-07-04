const mongoose=require('mongoose')

const offerSchema=new mongoose.Schema({
   
    product_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product',
        required:true
    },
    percentage:{
    type:Number,
    required:true
   }
})


const collection= mongoose.model('offer',offerSchema)

module.exports=collection