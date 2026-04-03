import  { useEffect } from 'react'
import { FaComments, FaHeart, FaUserCircle } from 'react-icons/fa';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

const MyPost = (props) => {
  const context=useOutletContext();
  const navigate=useNavigate();
  const {id}=useParams();
    const api_url=process.env.REACT_APP_API_URL;
    const {posts,setmyposts,refreshtrigger,liked,setliked}=props;
    
    const myposts=posts.filter(p=>p.userid===id);
    const hearthandle=async(id,mainpost) =>{
      if(liked.some(p=>p._id===id)){
        const response=await fetch(`${api_url}/api/v1/removelike`,{
          method:'PUT',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({postid:id}),
          credentials:'include',
        })
        if(response.ok){
          setliked(prev=>prev.filter(p=>p._id!==id));
          setmyposts(prev => prev.map(p=>p._id===id? {...p,likes:{...p.likes,count:p.likes.count-1}}:p)
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
          setmyposts(prev => prev.map(p=>p._id===id? {...p,likes:{...p.likes,count:p.likes.count+1}}:p))
          setliked(prev => [...prev, mainpost]);
        }
      }
    }
    function commenthandle(id){
      navigate(`/post/comments/${id}`);
    }
    
  return (
    <div id='post-cards'>
      <p>MY POSTS</p>
      {myposts.map((post)=>{
        return <div className='post-card'>
            <div className='profile'>
              <div><FaUserCircle className='user-icon'/></div>
              <div className='name'> {post.name}</div>
            </div>
            <div className='date'>{post.date}</div>
            <div className='text'>{post.text}</div>
            { post.imageurl&&
            <img src={post.imageurl} alt='' ></img>
            }
            <div className='interaction'>
                          {liked.some(p=>p._id==post._id)?(<button onClick={()=>hearthandle(post._id,post)}><FaHeart className='redheart'/>{post.likes.count>0 && (<div className='count'>{post.likes.count}</div>)}</button>)
                          :(<button onClick={()=>hearthandle(post._id,post)}><FaHeart className='heart'/>{post.likes.count>0 && (<div className='count'>{post.likes.count}</div>)}</button>)}
                          <button onClick={()=>commenthandle(post._id)}><FaComments className='comments'/></button>
            </div>
        </div>
      })}
    </div>
  )
}

export default MyPost
