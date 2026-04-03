const cloudinary=require('cloudinary').v2;
const postschema=require('../models/PostSchema');
const User=require('../models/User');
exports.postdata=async(req,res)=>{
    try{
        const userid=req.user._id;
        const image=req.files && req.files.image;
        let result;
        if(image){
        result=await cloudinary.uploader.upload(image.tempFilePath,{folder:'social-task'});
        }
        const {text}=req.body;
        let newpost;
        if(text && image){
        newpost=await postschema({text:text,imageurl:result.secure_url,name:req.user.name,userid:userid});
        }
        else if(text){
        newpost=await postschema({text:text,name:req.user.name,userid:userid});
        } 
        else if(image){
            newpost=await postschema({imageurl:result.secure_url,name:req.user.name,userid:userid});
        }
        await newpost.save();
        return res.status(200).json({
            message:"Post Created Successfully",
            success:true
        })
    }catch(error){
        return res.status(500).json({
            message:"Interval Server Error",
            success:false
        })
    }
}
exports.addlike=async(req,res)=>{
    try{
        const{postid}=req.body;
        const userid=req.user._id;
        const post=await postschema.findById(postid);
        if(post.likes.likedby.includes(userid)){
            return res.status(400).json({
                message:"user has already liked the post",
                success:false,
            })
        }
        else{
            post.likes.likedby.push(userid);
            post.likes.count=post.likes.likedby.length;
            await post.save();
        return res.status(200).json({
            message:"Liked Post",
            success:true,
        })
    }
    }catch(error){
        return res.status(500).json({
            message:"Interval Server Error",
            success:false
        })
    }
}
exports.removelike=async(req,res)=>{
    try{
        const {postid}=req.body;
        const userid=req.user._id;
        const post=await postschema.findById(postid);
        if(!post.likes.likedby.includes(userid)){
            return res.status(400).json({
                message:"User hasn't liked post before",
                success:false,
            })
        }
        else{
            post.likes.likedby=post.likes.likedby.filter((prev)=>prev.toString()!==userid.toString());
            post.likes.count=post.likes.likedby.length;
            await post.save();
        return res.status(200).json({
            message:"Like Removed",
            likes:post.likes.count,
            success:true,
        })
    }
    }catch(error){
        return res.status(500).json({
            message:"Interval Server Error",
            success:false
        })
    }
}

exports.addcomment=async(req,res)=>{
    try{
        const id=req.user._id;
        const {text,postid}=req.body;
        const post=await postschema.findById(postid);
        post.comments.push({commentby:id,text:text,username:req.user.name});
        await post.save();
        return res.status(200).json({
            message:"comment added successfully",
            success:true,
        })
    }catch(error){
        return res.status(500).json({
            message:"Interval Server Error",
            success:false
        })
    }
}
