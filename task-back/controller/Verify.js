const jwt=require('jsonwebtoken');
require('dotenv').config();
exports.verifylogin=async(req,res,next)=>{
    try{
        const token=req.cookies.token;
        if(!token){
            return res.status(400).json({
                message:'User Not Logged In',
                success:false
            })
        }
        let decode=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decode;
        next();
    }catch(error){
        return res.status(500).json({
            message:"Interval Server Error",
            success:false
        })
    }
}
exports.checkauth=async(req,res)=>{
       
        return res.status(200).json({
            success:true,
            message:"User already logged in",
            user:{email:req.user.email,name:req.user.name,_id:req.user._id}
        })
    
}