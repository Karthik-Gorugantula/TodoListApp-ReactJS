//utilities and hooks
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {NavLink, useNavigate} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './Login.css'
import { faEye, faEyeSlash, faUser } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";

function Login({setLoggedInUserInDatabase}) {

    //navigate function
    let navigate = useNavigate()
    
    //form related function
    let {register,handleSubmit} = useForm()
    
    //getting login data, userDetails will be set once the login is successful
    let [login,setLoginStatus] = useState({
        status : false,
        userDetails : {}   //useless or never really used, intentionally left undisturbed
    })

    //hide unhide password
    const [passwordType, setPasswordType] = useState("password");
    
    const togglePassword =()=>{
        if(passwordType==="password")
        {
            setPasswordType("text")
            return;
        }
        setPasswordType("password")
    }

    //when login fails
    let [failedLogin,setFailedLogin] = useState(false)
        
    //form submission
    const onFormSubmit = async(userData)=>{
        console.log("executed in form")
        let response = await axios.get("http://localhost:4000/users")
        let users = response.data
        users.forEach((user)=>{
            if(userData.username === user.username && userData.password === user.password)
            {
                console.log("userFound")
                setLoginStatus({status : true, userDetails:user})
                //updates loggedInUser in the database
                setLoggedInUserInDatabase(user)
                navigate("/todopage")
            }
            else
            {
                setFailedLogin(true)
                setTimeout(() => {
                    setFailedLogin(false) 
                }, 5000);
            }
        })
    }

    return (
        <div className="container h-75" style={{"marginTop" : "5vh"}}>
            <form onSubmit={handleSubmit(onFormSubmit)}>
                
                <nav className="nav nav-pills flex-column flex-sm-row gap-3 mb-3">
                    <NavLink className="nav-link text-sm-center bg-warning flex-sm-fill text-light" to="/login">Log In</NavLink>
                    <NavLink className="nav-link text-sm-center bg-warning flex-sm-fill text-light" to="/createuser">Sign Up</NavLink>
                </nav>
                <div className="p-3 h-75 border rounded loginPage">
                    <p className="text-primary text-center my-2 heading text-light">Login</p>
                    
                    <div className="input-group">
                        <span className="btn btn-dark btn-lg">
                            <FontAwesomeIcon icon={faUser} id="addonUser"></FontAwesomeIcon>
                        </span>
                        <input type="text" id="username" aria-describedby="addonUser" className="form-control" placeholder="Enter Username" {...register("username")}/>    
                    </div>
                            
                    <div className="input-group mt-3">
                        <span className="btn btn-dark btn-lg">
                            <FontAwesomeIcon icon={faLock} id="addonPassword"></FontAwesomeIcon>
                        </span>
                        <input type={passwordType} id="password" aria-describedby="addonPassword" className="form-control" placeholder="Password" {...register("password")}/>    
                        <button type="button" onClick={togglePassword} className="input-group-btn btn btn-light">
                        {
                            passwordType==="password" 
                            ?<FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                            :<FontAwesomeIcon icon={faEyeSlash}></FontAwesomeIcon>
                        }
                        </button>
                    </div>

                    {
                        failedLogin && 
                        <p className="text-danger text-center">Invalid Username / Incorrect Password... Try Again</p>
                    }

                    <button type="submit" className="mt-3 btn btn-light d-block mx-auto mb-5">Login</button>                    

                </div>    
            </form>
        </div>
    );
}

export default Login;