const mongoose=require('mongoose')

const returnSchema=new mongoose.Schema({
    
    order_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'order',
        required:true
    },
   
    reason:{
    type:String,
    required:true
   },
   return_date:{
    type:String,
    required:true
   }
})


const collection= mongoose.model('return',returnSchema)

module.exports=collection