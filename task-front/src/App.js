import './App.css';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Route,Routes} from 'react-router-dom';
import UserPost from './components/UserPost';
import UserLogin from './components/UserLogin';
import Allpost from './components/Allpost';
import Usercomment from './components/Usercomment';
function App() {
  const[posts,setposts]=useState([]);
  const[author,setauthor]=useState({});
  const [mode,setmode]=useState('allposts');
  const[refreshtrigger,setrefreshtrigger]=useState(false);
  const[loggedin,setisloggedin]=useState(false);
  const api_url=process.env.REACT_APP_API_URL;
  useEffect(()=>{
    async function loggedin() {
      const response=await fetch(`${api_url}/api/v1/checkauth`,{
        method:"POST",
        headers:{'Content-Type':"application/json"},
        credentials:'include'
      })
      const result=await response.json();
      if(result.success){
        setauthor(result.user);
        setisloggedin(true);
      }
      else{
        setisloggedin(false);
      }
    }
    loggedin();
  },[]);
  return (
    <div id="app">
      <Routes>
        <Route path='/login' element={ loggedin ? <Navigate to="/" replace /> : <UserLogin author={author} setauthor={setauthor} loggedin={loggedin} setisloggedin={setisloggedin}/> } />
        <Route path='/' element={<UserPost refreshtrigger={refreshtrigger} setrefreshtrigger={setrefreshtrigger} author={author} mode={mode} setmode={setmode} loggedin={loggedin} setisloggedin={setisloggedin}></UserPost>}>
          <Route  index element={<Navigate to='posts' replace/>}></Route>
          <Route path="posts" element={<Allpost posts={posts} setposts={setposts} refreshtrigger={refreshtrigger} setrefreshtrigger={setrefreshtrigger} author={author} mode={mode} loggedin={loggedin}/>}></Route>
        </Route>
        <Route path='/post/comments/:id' element={<Usercomment setposts={setposts} setrefreshtrigger={setrefreshtrigger} posts={posts} author={author}/>}></Route>
      </Routes>
    </div>
  );
} 

export default App;
