import {React, useEffect, useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { Button,Container,Row,Col } from 'react-bootstrap';
import NavBarComponent from './NavBarComponent';
import homeImage from "../../assets/images/home.svg";
import dogImage from "../../assets/images/dog.jpg";
import catImage from "../../assets/images/cat.jpg";

export default function HomePage() {
    const navigate = useNavigate();
    const [stations, setStations] = useState();
    const [animals, setAnimals] = useState([]);

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
      }, []);

    useEffect(() => {
        console.log('ciao');

        for (let i = 0; i < stations?.length; i++)
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
                setAnimals([...animals, myJson]);
            })
        }
    }, [stations])

    const styleCard = {
        width: '18rem'
    }

    return (
        <div>
            <NavBarComponent></NavBarComponent>
            <div className="text-center">
                <h1 className="main-title home-page-title">welcome to our app</h1>

                <br></br>
            <Container>


                {stations?.map( station => (
                    <div className="card mb-3 shadow bg-white rounded" style={styleCard}>
                        <img className="card-img-top" src={homeImage} alt="Station"/>
                        <div className="card-body">
                            <h5 className="card-title"> Station #{station['id']} </h5>
                        </div>
                    </div>
                ))}

                {animals?.map( animalArray => (
                    animalArray.map( animal => (
                        <div className="card mb-3 shadow bg-white rounded" style={styleCard}>
                            <img className="card-img-top" src={dogImage} alt="Station"/>
                            <div className="card-body">
                                <h5 className="card-title"> {animal['name']} </h5>
                            </div>
                        </div>
                    ))
                ))}

                {/*<Row>*/}
                {/*<Col>1 of 2</Col>*/}
                {/*<Col>2 of 2</Col>*/}
                {/*</Row>*/}
                {/*<Row>*/}
                {/*<Col>1 of 3</Col>*/}
                {/*<Col>2 of 3</Col>*/}
                {/*<Col>3 of 3</Col>*/}
                {/*</Row>*/}
                {/*{JSON.stringify(stations)}*/}
                {/*{JSON.stringify(animals)}*/}
            </Container>
            </div>
        </div>
        
    )
}
