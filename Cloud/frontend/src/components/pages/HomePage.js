import {React, useEffect, useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { Button,Container,Row,Col } from 'react-bootstrap';
import NavBarComponent from './NavBarComponent'

export default function HomePage() {
    const navigate = useNavigate();
    const [stations, setStations] = useState();
    const [animals, setAnimals] = useState();

    useEffect(()=>{
        console.log("Sono dentro homepage e localstorage vale" + localStorage.getItem("authenticated"))
        if(localStorage.getItem("authenticated") !== 'true'){
            console.log("devo tornare in login")
            navigate("/login");
            console.log("fatto")
        }

        fetch('/api/users/' + localStorage.getItem('username') + '/stations',
            {
                method: 'GET',
                headers:
                    {
                        'X-API-KEY' : localStorage.getItem('auth_token'),
                        'Content-Type' : 'application/json'
                    }
            }).then((response) => {
            if(!response.ok) throw new Error(response.status);
            return response.json();
        }).then((myJson) => {
            setStations(myJson);
        })

        for (let i = 0; i < stations.lenght; i++)
        {
            fetch('/api/users/' + localStorage.getItem('username') + '/stations/' + stations[i]['id'] + '/animals',
                {
                    method: 'GET',
                    headers:
                        {
                            'X-API-KEY' : localStorage.getItem('auth_token'),
                            'Content-Type' : 'application/json'
                        }
                }).then((response) => {
                if(!response.ok) throw new Error(response.status);
                return response.json();
            }).then((myJson) => {
                setAnimals(myJson);
            })
        }
      }, []);

    return (
        <div>
            <NavBarComponent></NavBarComponent>
            <div className="text-center">
                <h1 className="main-title home-page-title">welcome to our app</h1>
               
                <br></br>
            <Container>
                <Row>
                <Col>1 of 2</Col>
                <Col>2 of 2</Col>
                </Row>
                <Row>
                <Col>1 of 3</Col>
                <Col>2 of 3</Col>
                <Col>3 of 3</Col>
                </Row>

                {/*{stations.map( station => (*/}
                {/*    <p id={station['id']}> {station['id']} </p>*/}
                {/*))}*/}
                {}
                {JSON.stringify(stations)}
            </Container>
            </div>
        </div>
        
    )
}
