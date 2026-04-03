import { useEffect, useState } from 'react'
import { FaComments, FaHeart, FaUserCircle } from 'react-icons/fa';
import './Usercomment.css';
import { IoIosSend } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom'

const Usercomment = (props) => {
  const navigate=useNavigate();
  const {id}=useParams();
  const[text,settext]=useState('');
  const{posts,setposts,author,setrefreshtrigger}=props;
  const api_url=process.env.REACT_APP_API_URL;
  const selectedpost=posts.filter(p=>p._id===id);
  const hearthandle=async(id,mainpost) =>{ 
      if(mainpost.likes.likedby.some((p)=>p===author._id)){
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
    function commenthandle(id,selectedpost){
      navigate(`/post/comments/${id}`,{state:{selectedpost}});
    }
    const addcomment=async()=>{
      const response=await fetch(`${api_url}/api/v1/addcomment`,{
        method:"PUT",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({postid:id,text:text}),
        credentials:'include',
      })
      if(response.ok){
        const newcomment={username:author.name,text:text,date:new Date().toLocaleString()};
        setposts(prev=>prev.map(p=>p._id===id?{...p,comments:[...p.comments,newcomment]}:p));
        setrefreshtrigger(prev=>!prev);
        settext('');
      }
    }
    
  return (
    <div id='selectedpost-cards'>
      <div className='post-card-comment'>
          <div className='profile'>
            <div><FaUserCircle className='user-icon'/></div>
            <div className='name'> {selectedpost[0].name}</div>
          </div>
          <div className='date'>{new Date(selectedpost[0].date).toLocaleString()}</div>
          <div className='text'>{selectedpost[0].text}</div>
          { selectedpost[0].imageurl&&
            <img src={selectedpost[0].imageurl} alt='' ></img>
          }
          <div className='interaction'>
              {selectedpost[0].likes.likedby.some(p=>p===author._id)?(<button onClick={()=>hearthandle(selectedpost[0]._id,selectedpost[0])}><FaHeart className='redheart'/>{selectedpost[0].likes.count>0 && (<div className='count'>{selectedpost[0].likes.count}</div>)}</button>)
              :(<button onClick={()=>hearthandle(selectedpost[0]._id,selectedpost[0])}><FaHeart className='heart'/>{selectedpost[0].likes.count>0 && (<div className='count'>{selectedpost[0].likes.count}</div>)}</button>)}
              <button onClick={()=>{commenthandle(selectedpost[0]._id,selectedpost[0])}}><FaComments className='comments'/></button>
          </div>


          <div id="comment-text"><input type='text' placeholder="what's your comment" value={text}  onChange={(e)=>settext(e.target.value)}></input><button onClick={addcomment}><IoIosSend id="icon"/></button></div>
          <div>ALL COMMENTS</div>
          {selectedpost[0].comments.map((comment)=>{
              return <div className='comment-card'>
                <div className='comment-user'>
                  <div><FaUserCircle className='usericon'/></div>
                  <div className='user-name'> {comment.username}</div>
                </div>
                <div className='date'>{new Date(comment.date).toLocaleString()}</div>
                <div className='comment-text'>{comment.text}</div>

              </div>
            })}
      </div>
    </div>
  )
}

export default Usercomment
