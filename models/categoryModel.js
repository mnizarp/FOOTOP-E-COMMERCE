const mongoose=require('mongoose')

const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    list:{
        type:Number,
        required:true
    }
    
})


const collection= mongoose.model('category',categorySchema)

module.exports=collection