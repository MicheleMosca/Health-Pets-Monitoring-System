import {React, useEffect, useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { Button,Container,Row,Col } from 'react-bootstrap';
import NavBarComponent from './NavBarComponent';
import homeImage from "../../assets/images/home.jpg";
import dogImage from "../../assets/images/dog.jpg";
import catImage from "../../assets/images/cat.jpg";
import BackgroundImage from '../../assets/images/pattern.jpg'

export default function HomePage() {
    const navigate = useNavigate();
    const [stations, setStations] = useState();
    const [animals, setAnimals] = useState([]);
    const [foods, setFoods] = useState([]);
    const [waters, setWaters] = useState([]);
    const [beats, setBeats] = useState([]);

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

    useEffect(() => {
        for (let i = 0; i < stations?.length; i++)
        {
            fetch('/api/users/' + localStorage.getItem('username') + '/stations/' + stations[i]['id'] + '/foods?limit=1',
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
                setFoods([...foods, myJson]);
            })
        }
    }, [stations])

    useEffect(() => {
        for (let i = 0; i < stations?.length; i++)
        {
            fetch('/api/users/' + localStorage.getItem('username') + '/stations/' + stations[i]['id'] + '/waters?limit=1',
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
                setWaters([...waters, myJson]);
            })
        }
    }, [stations])

    useEffect(() => {
        for (let i = 0; i < stations?.length; i++)
        {
            for (let j = 0; j < animals[i]?.length; j++)
            {
                fetch('/api/users/' + localStorage.getItem('username') + '/stations/' + stations[i]['id'] + '/animals/' + animals[i][j]['id'] + '/beats?limit=1',
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
                    setBeats([...beats, myJson]);
                })
            }
        }
    }, [animals])

    const styleCard = {
        width: '18rem'
    }

    const styleBack = {
        background: `url(${BackgroundImage})`,
        backgroundPosition: "25% - 25%",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
    }

    function getStations()
    {
        const html = [];
        for (let i = 0; i < stations?.length; i++)
        {
            html.push(
                <div className="col">
                    <div className="card mb-3 shadow bg-white rounded" style={styleCard}>
                        <img className="card-img-top" src={homeImage} alt="Station"/>
                        <div className="card-body">
                            <h5 className="card-title text-center"> Station #{stations[i]['id']} </h5>
                            <br/>
                            <h5 className="card-text"> Food Level: {foods[i]?.map(food => (food['value'].toUpperCase()))} </h5>
                            <h5 className="card-text"> Water Level: {waters[i]?.map(water => (water['value'].toUpperCase()))} </h5>
                        </div>
                    </div>
                </div>
            )
        }

        return html;
    }

    function getAnimals()
    {
        const html = []

        animals?.map( animalArray => {
            for (let i = 0; i < animalArray.length; i++)
            {
                html.push(
                    <div className="col">
                        <div className="card mb-3 shadow bg-white rounded" style={styleCard}>
                            {animalArray[i]['animal_type'] === 'dog' ?
                                <img className="card-img-top" src={dogImage} alt="Station"/> :
                                <img className="card-img-top" src={catImage} alt="Station"/>}
                            <div className="card-body">
                                <h5 className="card-title text-center"> {animalArray[i]['name']} </h5>
                                <br/>
                                <h5 className="card-text"> Temperature: {animalArray[i]['temperature']} °C</h5>
                                <h5 className="card-text"> Bark: {String(animalArray[i]['bark']).toUpperCase()}</h5>
                                <h5 className="card-text"> Beats: {beats[i]?.map(beat => (beat['value']))} bpm</h5>
                            </div>
                        </div>
                    </div>
                )
            }
        })

        return html;
    }

    return (
        <header style={styleBack}>
            <div>
                <NavBarComponent/>
                <br></br>
                <Container>
                    <div className="container">
                        <h3>Stations</h3>
                        <div className="row row-cols-1 row-cols-md-3 g-4 mt-2">
                            {getStations()}
                        </div>
                    </div>
                    <br/>
                    <div className="container">
                        <h3>Animals</h3>
                        <div className="row row-cols-1 row-cols-md-3 g-4 mt-2">
                            {getAnimals()}
                        </div>
                    </div>
                </Container>
            </div>
        </header>
    )
}
