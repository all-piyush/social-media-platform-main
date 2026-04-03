import{ useState } from 'react'
import { IoCamera } from "react-icons/io5";
import {Outlet, useNavigate} from 'react-router-dom';
import './UserPost.css'
const UserPost = (props) => {
  const{liked,setliked,refreshtrigger,setrefreshtrigger,author ,setmode,loggedin,setisloggedin}=props;
  const navigate=useNavigate();
  const[submitting,setsubmitting]=useState(false);
  const api_url=process.env.REACT_APP_API_URL;
  const[image,setimage]=useState(null);
  const [textarea,settextarea]=useState('');
  const [preview,setpreview]=useState(null);
  const[count,setcount]=useState(0);
  const filechange=(e)=>{
    const selected=e.target.files[0];
    setimage(selected);
    if(selected){
      setpreview(URL.createObjectURL(selected));
    }
  }
  function changepreview(){
    setpreview(null);
    setimage(null);
  }
  function changetext(e){
    settextarea(e.target.value);
  }
  const handlenewpost=async()=>{
    setsubmitting(true);
    const formdata=new FormData();
    if(image){
    formdata.append('image',image);
    }
    formdata.append('text',textarea);

    try{
      const response=await fetch(`${api_url}/api/v1/newpost`,{
        method:"POST",
        body:formdata,
        credentials:'include'
      })
      if(response.ok){
        
        setrefreshtrigger((prev)=>!prev);
        setpreview(null);
    setimage(null);
    settextarea("");
      }
      setsubmitting(false);
    }catch(error){
      console.log(error);
    }
  }
  const handlelogout=async()=>{
    
    try{
      const response=await fetch(`${api_url}/api/v1/logout`,{
        method:"GET",
        credentials:'include'
      })
      if(response.ok){
        setmode('allposts');
        setisloggedin(false);
        navigate('/login');
      }
    }catch(error){
      console.log(error);
    }
  } 
  function handleallposts(){
    setmode('allposts');
  }
  function handlemyposts(){
    setmode('myposts');
  }
  return (
    <div id='container' onClick={()=>{!loggedin?(navigate('/login')):(<></>)}}>
      <div id='post'>
        <div id='post-top'>
            <div id='heading'>Create Post</div>
            <div id='heading-buttons'>
                <button onClick={handleallposts}>All Posts</button>
                <button onClick={handlemyposts}>My Posts</button>
                <button onClick={handlelogout} className='login-button'>{loggedin ? 'Logout' : 'Login'}</button>
            </div>
        </div>
        <textarea placeholder="Whats's On Your Mind?" value={textarea} onChange={changetext}></textarea>
        {preview &&<div >
          <div id='preview-container'>
          <div >Preview</div>
          <button onClick={changepreview} className='remove'>Remove Image</button>
          </div>
          <img src={preview} alt="img" className='preview-img'></img>
          </div>
          }
          
        <div id='post-end'>
        <label htmlFor='input-image' className='input-label'><IoCamera className='icon' /> ADD IMAGE</label>
        <input type='file' onChange={filechange} accept='image/*' id='input-image'></input>
        <button type='submit' onClick={handlenewpost} disabled={submitting}>Post</button>
        </div>
      </div>
      <Outlet context={{refreshtrigger,liked,setliked,count,setcount,setrefreshtrigger}}/>
    </div>
  )
}

export default UserPost
