const mongoose=require('mongoose');

const postschema=new mongoose.Schema({
    text:{
        type:String,
    },
    imageurl:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    name:{
        type:String,
        required:true
    },
    likes:{
        count:{type:Number,default:0,},
        likedby:[{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}],
    },
    comments:[
        {
            commentby:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
            username:{type:String,required:true},
            text:{type:String,required:true},
            date:{type:Date,default: Date.now},
        }
    ]
})
module.exports=mongoose.model('postschema',postschema);