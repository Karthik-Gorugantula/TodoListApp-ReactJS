//importing components
import Login from "./Components/Login";
import CreateUser from "./Components/CreateUser";
import TodoPage from "./Components/TodoPage";
import Profile from "./Components/Profile";
import Home from "./Components/Home";
import "./App.css"

//import hooks
import { useEffect, useState } from "react";
import {NavLink, Route,Routes,useNavigate } from "react-router-dom";
import axios from "axios";

function App() {

  const navigate = useNavigate()

  let [loggedInUser,setLoggedInUser] = useState({status : false, details : {}})

  useEffect(()=>{
    checkLoggedInUser()
    fetchUsers()
  },[])

  //function to check if any user is logged in from the database
  const checkLoggedInUser = async () =>{
    let response = await axios.get("http://localhost:4000/loggedInUser")
    let user = response.data
    if(user.length===1)
    {
      //update with latest info of logged in user
      updateLoggedInUser(user[0].id)
    }
  }

  const updateLoggedInUser = async(userId)=>{
      let updatedResponse = await axios.get(`http://localhost:4000/users/${userId}`)
      setLoggedInUser({...loggedInUser,status : true,details :updatedResponse.data})
  }

  //getting users from database
  let [users,setUsers] = useState([])

  const fetchUsers = async () => {
      let response = await axios.get("http://localhost:4000/users")
      let usersList = response.data
      setUsers(usersList)
  }

  //a function to set the current active user (logged in user) in the database
  const setLoggedInUserInDatabase=async(user)=>{
    let response = await axios.post("http://localhost:4000/loggedInUser",user)
    if(response.status === 201)
        console.log(`${user.username} has logged in successfully`)
    console.log("No user foud")
    checkLoggedInUser()
  }

  //logout function to delete loggedIn user data from database
  const logout= async ()=>{
    let response = await axios.delete(`http://localhost:4000/loggedInUser/${loggedInUser.details.id}`)
    console.log(response)
    setLoggedInUser({status : false, details : {}})
    navigate("/home")
  }

  return (
    <div className="mt-5 container col-11 col-md-7 border border-3 rounded mainContainer">
        <nav className="navbar sticky-top navbar-expand-lg navbar-dark mt-2 rounded navBar">
          <div className="container-fluid">
            <NavLink className="navbar-brand logo" to="home">TodoList</NavLink>
            <ul className="navbar-nav">
              {
                (!loggedInUser.status)
                ?
                <li className="nav-item">
                  <NavLink className="btn nav-link btn-light text-dark loginButton" to="login">Login</NavLink>  
                </li>
                :
                // <h1 className="display-6">Hello {loggedInUser.details.username}</h1>
                <div className="dropdown">
                  <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    Hello {loggedInUser.details.username}
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li><NavLink className="dropdown-item profile" onClick={()=>checkLoggedInUser()} to="profile">Profile</NavLink></li>
                    <li><NavLink className="dropdown-item profile" to="todopage">Go to Todos</NavLink></li>
                    <li><button onClick={logout} className="dropdown-item logout">Logout</button></li>
                  </ul>
                </div>
              }
            </ul>
          </div>
        </nav>
        {/* //defining routes to the respective components */}
        <Routes>
          <Route path="" element={<Home loggedInUser={loggedInUser}/>}/>
          <Route path="/home" element={<Home loggedInUser={loggedInUser}/>}/>
          <Route path="/login" element={<Login checkLoggedInUser={checkLoggedInUser} users={users} fetchUsers={fetchUsers} setLoggedInUserInDatabase={setLoggedInUserInDatabase}/>}/>
          <Route path="/todopage" element={<TodoPage/>}/>
          <Route path="/createuser" element={<CreateUser usersLength={users.length} fetchUsers={fetchUsers} setLoggedInUserInDatabase={setLoggedInUserInDatabase}/>}/>
          <Route path="/profile" element={<Profile loggedInUser = {loggedInUser} checkLoggedInUser={checkLoggedInUser}/>}></Route>
        </Routes>
    </div>  
  );
}
export default App;