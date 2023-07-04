const mongoose=require('mongoose')

const returnedSchema=new mongoose.Schema({
    
    order_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'order',
        required:true
    },
   
   returned_date:{
    type:String,
    required:true
   }
})


const collection= mongoose.model('returned',returnedSchema)

module.exports=collection