import {React,useEffect} from 'react'
import { Link,useNavigate } from 'react-router-dom'

export default function HomePage() {
    const navigate = useNavigate();

    useEffect(()=>{
        console.log("Sono dentro homepage e localstorage vale" + localStorage.getItem("authenticated"))
        if(localStorage.getItem("authenticated") !== 'true'){
            console.log("devo tornare in login")
            navigate("/login");
            console.log("fatto")
        }
      });

    return (
        <div className="text-center">
            <h1 className="main-title home-page-title">welcome to our app</h1>
            <Link to="/login">
                <button className="primary-button">Log out</button>
            </Link>
        </div>
    )
}
