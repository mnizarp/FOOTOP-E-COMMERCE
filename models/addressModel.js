const mongoose=require('mongoose')

const addressSchema=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
     name:{
        type:String,
        required:true
     },
     housename:{
        type:String,
        required:true
     },
     street:{
        type:String,
        required:true
     },
     district:{
        type:String,
        required:true
     },
     state:{
        type:String,
        required:true
     },
     country:{
        type:String,
        required:true
     },
     pincode:{
        type:String,
        required:true
     },
     phone:{
      type:String,
      required:true
     }
})


const collection= mongoose.model('address',addressSchema)

module.exports=collection