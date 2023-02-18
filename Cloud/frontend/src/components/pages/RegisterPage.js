import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button,Form } from 'react-bootstrap';

import '../../App.css'

export default function SignUpPage() 
{
    const [username, setUsername] = useState/*<string*/("");
    const [password, setPassword] = useState/*<string*/("");
    const [name, setName] = useState/*<string*/("");
    const [data, setData] = useState("");
    const [authenticated, setAuthenticated] = useState(localStorage.getItem(localStorage.getItem("authenticated") || false));
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);

    const handleOnChange = () => {
        setChecked(!checked);
    }

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

    window.onload = () => {
        console.log("Pulisco storage");
        localStorage.clear(); //pulisco local storage
    }

    const validateSignup = () => {
        const { username, name, password } = form;
        const newErrors = {}
        console.log("Val checkbox " + checked);

        if(checked === false)
        {
            newErrors.checked = "You have to accept our terms of service";
        }

        if(!username || username === '')
        {
            newErrors.username = "Please enter the username";
        }

        if(!name || name === '')
        {
            newErrors.name = "Please enter your name";
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

    const handleSignup = (e) => {
        e.preventDefault();
        console.log("Dentro handle signup");

        const signupData = {
            "username": form.username,
            "password": form.password,
            "name": form.name
        }
        console.log("Ecco i dati del signup " + JSON.stringify(signupData))
        console.log("Ecco data " + JSON.stringify(data))

        const formErrors = validateSignup();
        if(Object.keys(formErrors).length > 0)
        {
            setErrors(formErrors);
            return;
        }

        fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData)
        }).then( (response) => {
            if(!response.ok) throw new Error(response.status);
            else { 
                return response.text(); 
            }
        }).then ( (res) => {
            console.log("Risposta data: " + res);
            setData(res)
            navigate("/login");
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
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={form.name}
                        onChange={event => setField("name", event.target.value)}
                        isInvalid={!!errors.name}
                    ></Form.Control>
                    <Form.Control.Feedback type='invalid'>
                        {errors.name}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={form.password}
                        onChange={event => setField("password", event.target.value)}
                        isInvalid={!!errors.password}
                    ></Form.Control>
                    <Form.Control.Feedback type='invalid'>
                        {errors.password}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="text-center mb-3" controlId="checkbox">
                    <Form.Label>I agree all statements in <a href="https://google.com" target="_blank" rel="noopener noreferrer">terms of service</a>.</Form.Label>
                    <Form.Check
                        className="text-right"
                        type="checkbox"
                        value={checked}
                        checked={checked}
                        onChange={handleOnChange}
                        isInvalid={!checked}
                    ></Form.Check>
                </Form.Group>
                <br></br>
                <div className="mt-3">
                    <Button variant="dark" onClick={handleSignup}>
                        Enter
                    </Button>
                </div>
            </Form>
            <footer>
                <p><Link to="/">Back to Homepage</Link>.</p>
            </footer>
        </div>
    )

}
