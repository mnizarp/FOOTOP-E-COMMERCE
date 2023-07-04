const mongoose=require('mongoose')

const couponSchema=new mongoose.Schema({
   code:{
    type:String,
    required:true
   },
   discount_price:{
    type:String,
    required:true
   },
   discount_category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'category',
    required:true
   },
   min_purchase:{
    type:Number,
    required:true
   },
   expiry:{
    type:Date,
    required:true
   }


})


const collection= mongoose.model('coupon',couponSchema)

module.exports=collection