const mongoose=require('mongoose')

const ProductSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    }, 
    category_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category',
        required:true
    },
    price:{
      type:Number,
      required:true
    },
    stock:{
       type:Number,
       required:true
    },
    description:{
      type:String,
      required:true
    },
    image:{
      type:Array,
      required:true,
      validate:[arraylimit,"maximum 4 product image"]

    },
    isDeleted:{
      type:Boolean,
      default:false
  },
  offerprice:{
    type:Number
      
  }
    
})

function arraylimit(val){
  return val.length<=4;
}

const collection= mongoose.model('product',ProductSchema)

module.exports=collection