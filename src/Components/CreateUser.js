import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form"; 
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import './CreateUser.css'
function CreateUser({usersLength,fetchUsers,setLoggedInUserInDatabase}) {
    
    let navigate = useNavigate()

    let [created,setCreated] = useState(false)

    let {register,handleSubmit,formState:{errors}}= useForm()

    const createUser= async(newUser)=>{
        newUser = {...newUser,todos:[],completedTodos:[]}
        let response = await axios.post("http://localhost:4000/users",newUser)
        console.log("user added")
        setCreated(true)
        setLoggedInUserInDatabase({...newUser, id : usersLength+1})
        fetchUsers()
        navigate("/todopage")
    }

    return (
        <div className="container h-75" style={{"marginTop" : "5vh"}}>
            <nav className="nav nav-pills flex-column flex-sm-row gap-3 mb-3">
                <NavLink className="nav-link text-sm-center bg-warning flex-sm-fill text-light" to="/login">Log In</NavLink>
                <NavLink className="nav-link text-sm-center bg-warning flex-sm-fill text-light" to="/createuser">Sign Up</NavLink>
            </nav>
            <form className="p-3 createUser rounded" onSubmit={handleSubmit(createUser)}>
                <p className="text-primary text-center my-2 heading text-light">Create New User</p>
                <div className="form-floating">
                    <input type="text" id="username" className="form-control mb-1" placeholder="Enter a username" {...register("username")}/>
                    <label htmlFor="username" className="text-secondary">Enter a Username</label>
                </div>

                <div className="form-floating">
                    <input type="email" id="email" className="form-control mb-1" placeholder="Enter a valid email id" {...register("email")}/>
                    <label htmlFor="email" className="text-secondary">Enter your Email ID</label>
                </div>

                <div className="form-floating">
                    <input type="password" id="password" className="form-control mb-1" placeholder="Enter a password" {...register("password")}/>
                    <label htmlFor="password" className="text-secondary">Enter Password</label>
                </div>
                <button type="submit" className="btn btn-light mt-3 d-block mx-auto">Create</button>                
            </form>
        </div>
    );
}

export default CreateUser;