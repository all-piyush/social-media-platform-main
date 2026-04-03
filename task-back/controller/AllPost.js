const Post=require('../models/PostSchema');
exports.allposts=async(req,res)=>{
    try{
        const posts=await Post.find({});
        return res.status(200).json({
            message:"All Posts Fetched Successfully",
            allposts:posts,
            success:true,
        })
    }catch(error){
        return res.status(500).json({
            message:"Internal Server Error",
            success:false,

        })
    }
}
