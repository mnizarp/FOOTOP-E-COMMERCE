const mongoose=require('mongoose')

const orderSchema=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
   product_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'product',
    required:true
   },
   address_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'address',
    required:true
   },
   quantity:{
     type:Number,
     required:true
   },
   total:{
     type:Number,
     required:true
   },
   order_date:{
    type:String,
    required:true
   },
   payment_method:{
    type:String,
    required:true
   },
   coupon_code:{
    type:String,
   
   },
   status:{
     type:String,
     required:true
   },
   delivery_date:{
    type:Date,
    
   },
   
})


const collection= mongoose.model('order',orderSchema)

module.exports=collection