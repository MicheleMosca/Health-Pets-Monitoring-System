import React, { useState, useEffect } from 'react';
import { Link , useNavigate } from 'react-router-dom'
import { Button,Container,Row,Col,Modal,Form, Card } from 'react-bootstrap';
import { environment } from '../constants';

import '../../App.css'

export default function SignInPage()
{
    const [data,setData]=useState("");
    const [authenticated, setauthenticated] = useState(localStorage.getItem(localStorage.getItem("authenticated")|| false));
    const navigate = useNavigate();

    /*Validate form*/
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});
    const setField = (field, value) => {
        setForm({
            ...form,
            [field]: value
        })

        if(!!errors[field])
        {
            setErrors({
                ...errors,
                [field]: null
            })
        }
    }


    window.onload= () => {
    console.log("Pulisco storage");
    localStorage.clear(); //pulisco local storage
    }

    const validateLogin = () => {
        const { username, password } = form;
        const newErrors = {}
        console.log(username === '');

        if(!username || username === '')
        {
            newErrors.username = "Please enter the username";
        }

        if(!password || password === '')
        {
            newErrors.password = "Please enter the password";
        }

        if(Object.keys(newErrors).length > 0)
        {
            return newErrors;
        }
        console.log(newErrors);
        return newErrors;
    }

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Dentro Handle Login");

        const loginData = {
            "username": form.username,
            "password": form.password
        }
        console.log("Ecco i dati del login " + JSON.stringify(loginData))
        console.log("Ecco data  " + JSON.stringify(data))

        const formErrors = validateLogin();
        if(Object.keys(formErrors).length > 0)
        {
            setErrors(formErrors);
            return;
        }
          console.log("Sto per fare richiesta a "+ environment.site +'/api/login' )
          fetch(environment.site+'/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginData)
          }).then( (response) => {
            if(!response.ok) throw new Error(response.status);
            else {
                localStorage.setItem("authenticated", true);
                setauthenticated(true)
                return response.text();
            }
          })  //fixare con status code
          .then((res) => {
             console.log("Risposta data" + res);
             localStorage.setItem("auth_token",res);
             localStorage.setItem("username", form.username)
             setData(res)
             if(localStorage.getItem("authenticated"))
                navigate("/home");
          }).catch((err) => {
             console.log(err.message);
             setErrors({username: "Invalid username or password", password: "Invalid username or password"});
          });
          console.log("finito richiesta");
          console.log("Ecco il token trovato " + data)

      };

    return (
        <div className="text-center m-5-auto">
            <h2>Sign in to us</h2>
            <Form>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        autoFocus
                        value={form.username}
                        onChange={event => setField("username", event.target.value)}
                        isInvalid={!!errors.username}
                    ></Form.Control>
                    <Form.Control.Feedback type='invalid'>
                        {errors.username}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={form.removeAnimalID}
                        onChange={event => setField("password", event.target.value)}
                        isInvalid={!!errors.password}
                    ></Form.Control>
                    <Form.Control.Feedback type='invalid'>
                        {errors.password}
                    </Form.Control.Feedback>
                </Form.Group>
                <div className="">
                    <Button variant="dark" onClick={handleLogin}>
                        Enter
                    </Button>
                </div>
            </Form>
            <footer>
                <p>First time? <Link to="/register">Create an account</Link>.</p>
                <p><Link to="/">Back to Homepage</Link>.</p>
            </footer>
        </div>
    )
}
