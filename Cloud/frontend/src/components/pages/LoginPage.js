import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

import '../../App.css'

export default function SignInPage() {

const [username, setUsername] = useState/*<string>*/("");       
const [password, setPassword] = useState/*<string>*/(""); 
const [data,setData]=useState(""); 

const handleLogin = () => {
 
    console.log("Dentro Handle Login");
   /*  if (!email) {
        setMessage("Per favore inserisci un formato di email valida");
        setIserror(true);
        return;
    }
    if (validateEmail(email) === false) {
        setMessage("La tua email non è valida");
        setIserror(true);
        return;
    }

    if (!password || password.length < 6) {
        setMessage("Per favore inserisci la password");
        setIserror(true);
        return;
    }
    */

    const loginData = {
        "username": username,
        "password": password
    }

      fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
      }).then((response) => response.json())
      .then((res) => { 
         //const dataParsed=JSON.parse(data);
         console.log("Risposta data" + res);
        // console.log("Dentro i campi " + JSON.stringify(data["latitude"]));
         setData(res)
      }).catch((err) => {
         console.log(err.message);
      });
      console.log("finito richiesta");
      console.log("Ecco il token trovato " + data)
    
    /*
    const api = axios.create({
        baseURL: environment.site_url_authenticate
    })
    api.post("", loginData)
        .then(res => {   
          console.log("resss",res)
          localStorage.setItem("auth_token",res.data.auth_token);
          localStorage.setItem("company_id",res.data.company_id);
          localStorage.setItem("driver_id",res.data.driver_id);
          localStorage.setItem("driver_email",email);
          localStorage.setItem("driver_name",res.data.driver_name);

          console.log("resss",localStorage.getItem("auth_token"));         
           history.push("/Rides");
         })
         .catch(error=>{
            setMessage("Autenticazione fallita! Per favore riprova");
            setIserror(true);
         }) */
  };



    
    return (
        <div className="text-center m-5-auto">
            <h2>Sign in to us</h2>
            <p /*action="/home"*/>
                <p>
                    <label>Username</label><br/>
                    <input value={username}  type="text" name="first_name" required onChange={event => setUsername(event.target.value)} />
                </p>
                <p>
                    <label>Password</label>
                    <Link to="/forget-password"><label className="right-label">Forget password?</label></Link>
                    <br/>
                    <input value={password} type="password" name="password" required onChange={event => setPassword(event.target.value)} />
                </p>
                <p>
                    <button id="sub_btn" /*type="submit" */ onClick={handleLogin} >Login</button>
                </p>
            </p>
            <footer>
                <p>First time? <Link to="/register">Create an account</Link>.</p>
                <p><Link to="/">Back to Homepage</Link>.</p>
            </footer>
        </div>
    )
}
