import { useNavigate } from 'react-router-dom'
import img from "../Assets/undraw_to_do_list_re_9nt7.svg"
import "./Home.css"
function Home({loggedInUser}) {
    let navigate = useNavigate()
    return (
        <div className="text-center d-flex flex-column mt-3 rounded h-75 justify-content-evenly p-4" style={{"backgroundColor":"#00ffbf"}}>
            <h1 className="display-4 brand" style={{"color" : ""}}><i>Todo List</i></h1>
            <img src={img} alt="" className='w-50 align-self-center'/>
            <p className="caption mt-2">List Your Tasks Here and Get Going With The Goals Of Your Day !!!</p>
            <button type="button" className="btn btn-light getStarted scale-up-center d-block mx-auto" onClick={()=>{loggedInUser.status===true ? navigate("/todopage") : navigate("/login")}}>Get Started</button>
        </div>
    );
}

export default Home;