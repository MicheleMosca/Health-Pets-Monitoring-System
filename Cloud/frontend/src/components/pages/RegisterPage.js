import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { environment } from '../constants';

import '../../App.css'

export default function SignUpPage() 
{
    const [username, setUsername] = useState/*<string*/("");
    const [password, setPassword] = useState/*<string*/("");
    const [name, setName] = useState/*<string*/("");
    const [data, setData] = useState("");
    const [authenticated, setAuthenticated] = useState(localStorage.getItem(localStorage.getItem("authenticated") || false));
    const navigate = useNavigate();

    window.onload = () => {
        console.log("Pulisco storage");
        localStorage.clear(); //pulisco local storage
    }

    const handleSignup = (e) => {
        e.preventDefault();
        console.log("Dentro handle signup");

        const signupData = {
            "username": username,
            "password": password,
            "name": name
        }
        console.log("Ecco i dati del signup " + JSON.stringify(signupData))
        console.log("Ecco data " + JSON.stringify(data))

        fetch(environment.site+'/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData)
        }).then( (response) => {
            if(!response.ok) throw new Error(response.status);
            else { 
                localStorage.setItem("authenticated", true);
                setAuthenticated(true)
                return response.text(); 
            }
        }).then ( (res) => {
            console.log("Risposta data: " + res);
            localStorage.setItem("auth_token", res);
            localStorage.setItem("username", username)
            setData(res)
            if(localStorage.getItem("authenticated"))
                navigate("/home");
        }).catch( (err) => {
            console.log(err.message);
        });
        console.log("finito richiesta");
        console.log("Ecco il nuovo token " + data)
    };

    return (
        <div className="text-center m-5-auto">
            <h2>Join us</h2>
            <h5>Create your personal account</h5>
            <form onSubmit={handleSignup}>
                <p>
                    <label>Username</label><br/>
                    <input type="text" name="username" required onChange = {event => setUsername(event.target.value)} />
                </p>
                <p>
                    <label>Name</label><br/>
                    <input type="text" name="first_name" required onChange = {event => setName(event.target.value)} />
                </p>
                <p>
                    <label>Password</label><br/>
                    <input type="password" name="password" required onChange = {event => setPassword(event.target.value)} />
                </p>
                <p>
                    <input type="checkbox" name="checkbox" id="checkbox" required /> <span>I agree all statements in <a href="https://google.com" target="_blank" rel="noopener noreferrer">terms of service</a></span>.
                </p>
                <p>
                    <button id="sub_btn" type="submit" /*onClick={handleSignup}*/ >Register</button>
                </p>
            </form>
            <footer>
                <p><Link to="/">Back to Homepage</Link>.</p>
            </footer>
        </div>
    )

}
