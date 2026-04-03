import  { useEffect, useState } from 'react'
import './Allpost.css';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaComments } from "react-icons/fa";
const Allpost = (props) => {
    const navigate=useNavigate();
    const api_url=process.env.REACT_APP_API_URL;
    const {posts,setposts,refreshtrigger,author,mode,loggedin}=props;
    const filteredposts=mode==="myposts"?(posts.filter(p=>p.userid===author._id)):(posts);
    
    async function getallposts() {
        try{
            const response=await fetch(`${api_url}/api/v1/allposts`,{
            method:"GET",
            credentials:'include'
          })
          const result=await response.json();
          if(response.ok){
            setposts(result.allposts);
          }
          }catch(error){
            console.log(error);
          }
      }
      
    const hearthandle=async(id,mainpost) =>{
      if(mainpost.likes.likedby.some((p)=>p==author._id)){
        const response=await fetch(`${api_url}/api/v1/removelike`,{
          method:'PUT',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({postid:id}),
          credentials:'include',
        })
        if(response.ok){
          setposts(prev => prev.map(p=>p._id===id? {...p,likes:{...p.likes,count:p.likes.count-1,likedby:p.likes.likedby.filter(uid=>uid!==author._id)}}:p)
        );
        }
      }
      else{
        const response=await fetch(`${api_url}/api/v1/addlike`,{
          method:'PUT',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({postid:id}),
          credentials:'include',
        })
        if(response.ok){
          setposts(prev => prev.map(p=>p._id===id? {...p,likes:{...p.likes,count:p.likes.count+1,likedby:[...p.likes.likedby, author._id]}}:p))
        }
      }
      
    }
    function commenthandle(id){
      navigate(`/post/comments/${id}`);
    }
    useEffect(() => {
  async function fetchData() {
    await getallposts();     
  }
  fetchData();
}, [refreshtrigger]); 
  
  return (
    <div id='posts-page' onClick={()=>{!loggedin?(navigate('/login')):(<></>)}}>
      <p> {mode === 'myposts' ? 'MY POSTS' : 'ALL POSTS'}</p>
      <div id="posts-wrapper">{filteredposts.map((post)=>{
        return <div className='post-card'>
            <div className='profile'>
              <div><FaUserCircle className='user-icon'/></div>
              <div className='name'> {post.name}</div>
            </div>
            <div className='date'>{new Date(post.date).toLocaleString()}</div>
            <div className='text'>{post.text}</div>
            { post.imageurl&&
            <img src={post.imageurl} alt='' ></img>
            } 
            <div className='interaction'>
              {post.likes.likedby.some(p=>p==author._id)?(<button onClick={()=>hearthandle(post._id,post)}><FaHeart className='redheart'/>{post.likes.count>0 && (<div className='count'>{post.likes.count}</div>)}</button>)
              :(<button onClick={()=>hearthandle(post._id,post)}><FaHeart className='heart'/>{post.likes.count>0 && (<div className='count'>{post.likes.count}</div>)}</button>)}
              <button onClick={()=>{commenthandle(post._id,post)}}><FaComments className='comments'/></button>
            </div>
        </div>
      })}</div>
    </div>
  )
}


export default Allpost
