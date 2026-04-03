const express=require('express');
const router=express.Router();
const{allposts}=require('../controller/AllPost');
const{postdata,addlike,removelike,addcomment}=require('../controller/Post');
const{verifylogin,checkauth}=require('../controller/Verify');
const{login,signup,logout}=require('../controller/Login');
router.post('/login',login);
router.post('/signup',signup);
router.post('/newpost',verifylogin,postdata);
router.get('/allposts',verifylogin,allposts);
router.put('/addlike',verifylogin,addlike);
router.put('/removelike',verifylogin,removelike);
router.put('/addcomment',verifylogin,addcomment);
router.post('/checkauth',verifylogin,checkauth)
router.get('/logout',verifylogin,logout);
module.exports=router;