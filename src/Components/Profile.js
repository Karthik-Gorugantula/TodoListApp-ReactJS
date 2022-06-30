import './Profile.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from "react";
import { faClipboardCheck, faUserCheck, faUserPen, faXmark , faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

function Profile({loggedInUser,checkLoggedInUser}){
    
    let [editStatus,setEditStatus] = useState(false);
    let [editPasswordStatus,setEditPasswordStatus] = useState(false);

    let [invalidOldPassword,setInvalidOldPassword] = useState(false);
    let [passwordUpdated,setPasswordUpdated] = useState(false);

    let {register,handleSubmit} = useForm();
    
    const passwordSubmit = (passwordObject) => {
        console.log(passwordObject)
        if(passwordObject.oldPassword !== loggedInUser.details.password)
        {
            setInvalidOldPassword(true)
            setTimeout(() => {
                setInvalidOldPassword(false)
            }, 4000);
        }
        else
        {
            updatePassword(passwordObject.newPassword);
            checkLoggedInUser()
        }
    }

    const updatePassword = async(newPassword) => {
        let response = await axios.put(`http://localhost:4000/users/${loggedInUser.details.id}`,{...loggedInUser.details, password : newPassword})
        console.log(response)
        console.log("password changed successfully")
        setPasswordUpdated(true)
        setTimeout(() => {
            setPasswordUpdated(false)
        }, 4000);
        setEditPasswordStatus(false)
        setEditStatus(false)
        setInvalidOldPassword(false)
    }

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

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit(passwordSubmit)}>
            {Object.keys(loggedInUser.details).length!==0 && 
                <div>
                    <p className="heading ms-3 mt-3">User Details <FontAwesomeIcon icon={faUserCheck} className="ms-2"></FontAwesomeIcon></p>
                    <hr />
                    <div className='row mt-3'>
                        <p className="forButtonlabel col-sm-5 text-center my-auto">Username</p>
                        <p className="userDetail col-sm-6 box border rounded my-auto">{loggedInUser.details.username}</p>
                    </div>
                    <div className='row mt-3'>
                        <p className="forButtonlabel col-sm-5 text-center my-auto">Email</p>
                        <p className="userDetail col-sm-6 box border rounded my-auto">{loggedInUser.details.email}</p>
                    </div>
                    <h3 className='heading mt-4 ms-3'>Tasks Info <FontAwesomeIcon icon={faClipboardCheck} className="ms-2"></FontAwesomeIcon></h3>
                    <hr />
                    <div className='row mt-3'>
                        <p className="forButtonlabel col-sm-5 text-center my-auto">Active Tasks</p>
                        <p className="col-sm-6 my-auto text-center display-4">{loggedInUser.details.todos.length}</p>
                    </div>
                    <div className='row mt-2'>
                        <p className="forButtonlabel col-sm-5 text-center my-auto">Completed Tasks</p>
                        <p className="col-sm-6 my-auto display-4 text-center">{loggedInUser.details.completedTodos.length}</p>
                    </div>
                    <h3 className='heading mt-3 ms-3'>User Settings <FontAwesomeIcon icon={faUserPen} className="ms-2"></FontAwesomeIcon></h3>
                    <hr />
                    {
                        passwordUpdated &&
                        <p className='text-success text-center'>Password Changed Successfully</p>
                    }
                    {
                        !editStatus &&
                        <div className='row mt-2'>
                            <button type="button" className="btn forButtonlabel text-center my-auto mb-4" onClick={()=>{setEditPasswordStatus(true);setEditStatus(true)}}>Change Password</button>
                        </div>
                    }
                    {
                        editStatus && editPasswordStatus &&
                        <div className='mb-4'>
                            <div className='d-flex justify-content-between'>
                                <p className='userDetail mb-3 ms-3'>Change Password</p>
                                <button type='button' className='btn into' onClick={()=>{setEditStatus(false);setEditPasswordStatus(false)}}><FontAwesomeIcon icon={faXmark}></FontAwesomeIcon></button>
                            </div>
                            
                            <input type="password" className="form-control" id="floatingPassword" placeholder="Old Password" {...register("oldPassword")}/>
                            
                            <div className='input-group mt-3 mb-3'>
                                <input type={passwordType} className="form-control" id="floatingConfirmPassword" placeholder="New Password" {...register("newPassword")}/>
                                <button type="button" onClick={togglePassword} className="input-group-btn btn btn-dark">
                                {
                                    passwordType==="password" 
                                    ?<FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                                    :<FontAwesomeIcon icon={faEyeSlash}></FontAwesomeIcon>
                                }
                                </button>
                            </div>
                            {
                                invalidOldPassword &&
                                <p className='text-danger text-center'>Please re-enter your current password correctly</p>
                            }
                            <button type='submit' className='btn btn-success d-block mx-auto'>Save</button>
                        </div>
                    }
                </div>
            }
            {Object.keys(loggedInUser.details).length===0 &&
                <h1 className="text-center text-danger">No One Has Logged In</h1>
            }
            </form>
        </React.Fragment>
    );
}

export default Profile;