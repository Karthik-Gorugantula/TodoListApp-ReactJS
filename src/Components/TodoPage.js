import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCheck, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faCheck, faCircle, faCircleCheck, faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import "./TodoPage.css"
function TodoPage() {
    //retrieving logged User data
    let [currentUser,setCurrentUser] = useState({todos : [],completedTodos:[]})

    //for searching active tasks purpose
    let [searchActiveTask,setSearchActiveTask] = useState("")
    //for searching completed tasks
    let [searchCompletedTask,setSearchCompletedTask] = useState("")
    
    useEffect(()=>{
        getCurrentUser()
    },[])

    const getCurrentUser = async() =>{
        let response = await axios.get("http://localhost:4000/loggedInUser")
        if(response.status === 200 && response.data.length!==0)
        {
            updateCurrentUser(response.data[0].id)
        }
    }

    const updateCurrentUser = async(id)=>{
        let response = await axios.get(`http://localhost:4000/users/${id}`);
        setCurrentUser({...currentUser,...response.data})
    }
    
    //handling form data
    let {register,handleSubmit} = useForm()

    const onFormSubmit =(taskObject)=>{
        //updating database whenever form is submitted the todo is added to the database
        updateCurrentUserTodosInDatabase(taskObject.task)        
    }

    //function to update todos in database
    const updateCurrentUserTodosInDatabase = async(todo) => {        
        setCurrentUser({...currentUser,todos:[...currentUser.todos, todo]})
        let response = await axios.put(`http://localhost:4000/users/${currentUser.id}`,{...currentUser,todos:[...currentUser.todos, todo]})
        getCurrentUser()
    }

    //removing task from userDatabase (assosicated with remove button)
    const removeTask = (task,value) => {
        if(value === false)
        {
            let tasks = currentUser.todos
            let index = -1;
            for(let i=0;i<tasks.length;++i)
            {
                if(task == tasks[i])
                {
                    index = i;
                    break;
                }
            }
            tasks.splice(index,1)
            let response = axios.put(`http://localhost:4000/users/${currentUser.id}`,{...currentUser,todos : [...tasks]})
            setCurrentUser({...currentUser,todos : [...tasks]})
        }
        else
        {
            let tasks = currentUser.completedTodos
            let index = -1;
            for(let i=0;i<tasks.length;++i)
            {
                if(task == tasks[i])
                {
                    index = i;
                    break;
                }
            }
            tasks.splice(index,1)
            let response = axios.put(`http://localhost:4000/users/${currentUser.id}`,{...currentUser,completedTodos : [...tasks]})
            setCurrentUser({...currentUser,completedTodos : [...tasks]})    
        }
    }

    //moves todos task to completedTodos on click (assosciated with checked box)
    const moveTaskToCompletedTodos=(task)=>{

        let index = -1;
        for(let i=0;i<currentUser.todos.length;++i)
        {
            if(task === currentUser.todos[i])
            {
                index = i;
                break;
            }
        }
        let activeTasks   = currentUser.todos
        let completedTasks = currentUser.completedTodos

        let removedTodo = activeTasks.splice(index,1)
        completedTasks.push(removedTodo[0])

        let response = axios.put(`http://localhost:4000/users/${currentUser.id}`,{...currentUser,completedTodos : [...completedTasks],todos:[...activeTasks]})
        setCurrentUser({...currentUser,completedTodos : [...completedTasks],todos:[...activeTasks]})
    }

    //moves completedTodos task to Todos on click (assosciated with checked box)
    const moveTaskToTodos=(task)=>{
        
        let index = -1;
        for(let i=0;i<currentUser.completedTodos.length;++i)
        {
            if(task===currentUser.completedTodos[i])
            {
                index = i;
                break;
            }
        }

        let activeTasks   = currentUser.todos
        let completedTasks = currentUser.completedTodos

        let removedTodo = completedTasks.splice(index,1)
        
        activeTasks.push(removedTodo[0])

        let response = axios.put(`http://localhost:4000/users/${currentUser.id}`,{...currentUser,completedTodos : [...completedTasks],todos:[...activeTasks]})
        setCurrentUser({...currentUser,completedTodos : [...completedTasks],todos:[...activeTasks]})
    }

    //css of remove
    function enter(e){
        e.target.style.color = 'red'
    }
    function leave(e){
        e.target.style.color = 'black'
    }

    return (
        <div className="mt-1">
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <h6 className="text-success form-label">Your tasks are eagerly waiting for you !</h6>
                <div className="input-group">
                    <input type="text" id="task" className="form-control " placeholder="Enter a Task Here" {...register("task")}/>
                    <button type="submit" className=" btn btn-success">Enter</button>
                </div>
                {currentUser.todos.length===0 && <p className="text-center text-danger display-6 mt-5">Oops Looks Like You are Idle</p>}
                {
                    currentUser.todos.length!==0 &&
                    <div>
                        <hr/>
                            <div className="d-flex container">
                                <p className="text-primary my-auto fs-5 fw-bold fst-italic col-4">Active</p>
                                <input className="form-control" type="text" placeholder="Search..." onChange={(event)=>{
                                    setSearchActiveTask(event.target.value)
                                }}/>
                            </div>
                        <hr/> 
                        {
                            currentUser.todos.filter((task)=>{
                                if(searchActiveTask==="")
                                    return task;
                                else if(task.toLowerCase().includes(searchActiveTask.toLowerCase()))
                                    return task;
                                else
                                    return null;
                            }).map((task,index)=>
                                <div key={index} className="d-flex">
                                    {/* has an input to check the task and place it into completed todos */}
                                    <button className="btn taskCheck" type="button" onClick={()=>moveTaskToCompletedTodos(task)}><FontAwesomeIcon size="1x" icon={faSquareCheck}/></button>
                                    <h5 className="text-dark p-3">{task}</h5>
                                    <FontAwesomeIcon className="btn ms-auto p-3" type="button" onClick={()=>removeTask(task,false)} onMouseEnter={enter} onMouseLeave={leave} icon={faTrashCan}/>
                                </div>
                            )
                        }
                    </div>
                }
                {
                    currentUser.completedTodos.length!==0 &&
                    <div>
                        <hr/>
                        <div className="d-flex container">
                            <p className="text-success my-auto fs-5 fw-bold fst-italic col-4">Completed</p>
                            <input className="form-control" type="text" placeholder="Search..." onChange={(event)=>{
                                setSearchCompletedTask(event.target.value)
                            }}/>
                        </div>
                        <hr/>
                        {
                            currentUser.completedTodos.filter(task=>{
                                if(searchCompletedTask==="")
                                    return task;
                                else if(task.toLowerCase().includes(searchCompletedTask.toLowerCase()))
                                    return task;
                                else
                                    return null;
                            }).map((task,index)=>
                                <div key={index} className="d-flex">
                                    {/* has an input to check the task and place it into completed todos */}
                                    <FontAwesomeIcon icon={faCheck} size="2x" className="text-success m-2"></FontAwesomeIcon>   
                                    <h5 className="text-dark p-2">{task}</h5>
                                    <div className="ms-auto p-1">
                                        <FontAwesomeIcon className="btn revertChecked" onClick={()=>moveTaskToTodos(task)} icon={faClockRotateLeft}></FontAwesomeIcon>
                                        <FontAwesomeIcon className="btn" type="button" onClick={()=>removeTask(task,true)} onMouseEnter={enter} onMouseLeave={leave} icon={faTrashCan}/>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                }
            </form>
        </div>
    );
}

export default TodoPage;