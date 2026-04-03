import  { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './UserLogin.css'
const UserLogin = (props) => {
    const navigate=useNavigate();
    const{author,setauthor,setisloggedin}=props;
      const [formdata,setformdata]=useState({name:"",email:"",password:""});
      const[user,setuser]=useState(false);
      const apiurl=process.env.REACT_APP_API_URL;
      function datachange(e){
        const {name,value}=e.target;
        setformdata((prev)=>({...prev,[name]:value}));
      }
      function changeuser(e){
        e.preventDefault();
        setuser((prev)=>!prev);
      }
      const submit=async(e)=>{
        e.preventDefault();
        const state=user?"login":"signup";
        const response=await fetch(`${apiurl}/api/v1/${state}`,{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({name:formdata.name,email:formdata.email,password:formdata.password}),
          credentials:'include'
        })
        const result=await response.json();console.log(result);
        if(result.success){
          console.log("ok");
          setauthor(result.user);
          setisloggedin(true);
          navigate('/');
        }
        else{
          console.log("error");
        }
        setformdata({email:"",password:"",name:""});
      }
      
      return (
        <div id="form" autoComplete='off'>
          {user?(
          <form id="login-form" onSubmit={submit}>
            <div className='heading'>Log In</div>
            <input type='email' placeholder='Enter Your Email' value={formdata.email} required name="email" onChange={datachange} autoComplete='email'></input>
            <input type='password' placeholder='Enter Your Password' value={formdata.password} name="password" required onChange={datachange} autoComplete='new-password'></input>
            <button onClick={changeuser} className='extra'>Create Account</button>
            <button type='submit' className='submit'>Log In</button>
          </form>
          ):(
          <form id="signup-form" onSubmit={submit}>
            <div className='heading'>Sign Up</div>
            <input type='name' placeholder='Enter Your Name' value={formdata.name} name="name" onChange={datachange} required></input>
            <input type='email' placeholder='Enter Your Email' value={formdata.email} name="email" onChange={datachange} required ></input>
            <input type='password' placeholder='Enter Your Password' value={formdata.password} name="password" onChange={datachange} required></input>
            <button onClick={changeuser} className='extra'>Already a User</button>
            <button type='submit' className='submit'>Sign Up</button>
          </form>)}
        </div>
      );
    }

export default UserLogin
