import {React, useEffect, useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { Button,Container,Row,Col } from 'react-bootstrap';
import NavBarComponent from './NavBarComponent';
import homeImage from "../../assets/images/home.jpg";
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
            <NavBarComponent/>
            <br></br>
            <Container>
                <div className="container">
                    <h3>Stations</h3>
                    <div className="row row-cols-1 row-cols-md-3 g-4 mt-2">
                        {stations?.map( station => (
                            <div className="col">
                                <div className="card mb-3 shadow bg-white rounded" style={styleCard}>
                                    <img className="card-img-top" src={homeImage} alt="Station"/>
                                    <div className="card-body">
                                        <h5 className="card-title text-center"> Station #{station['id']} </h5>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <br/>
                <div className="container">
                    <h3>Animals</h3>
                    <div className="row row-cols-1 row-cols-md-3 g-4 mt-2">
                        {animals?.map( animalArray => (
                            animalArray.map( animal => (
                                <div className="col">
                                    <div className="card mb-3 shadow bg-white rounded" style={styleCard}>
                                        { animal['animal_type'] === 'dog' ? <img className="card-img-top" src={dogImage} alt="Station"/> : <img className="card-img-top" src={catImage} alt="Station"/>}
                                        <div className="card-body">
                                            <h5 className="card-title text-center"> {animal['name']} </h5>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ))}
                    </div>
                </div>
            </Container>
        </div>
        
    )
}
