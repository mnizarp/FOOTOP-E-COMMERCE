const mongoose=require('mongoose')

const LoginSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
      type:String,
      required:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isadmin:{
        type:Number,
        required:true
    },
    reg_date:{
        type:String,
        required:true
    },
    block:{
        type:Boolean,
        default:false
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    wallet:{
        type:Number
    },
    referal_code:{
        type:String
    }
})

const collection= mongoose.model('user',LoginSchema)

module.exports=collection