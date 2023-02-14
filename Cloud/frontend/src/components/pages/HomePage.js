import {React, useEffect, useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { Button,Container,Row,Col,Modal,Form } from 'react-bootstrap';
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
    const [latitude, setLatitude] = useState/*float*/("");
    const [longitude, setLongitude] = useState/*float*/("");
    const [data, setData] = useState("");
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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

    const handleAddStation = (e) => {
        e.preventDefault();
        console.log("Dentro handle add station");

        const stationData = {
            "latitude": parseFloat(latitude),
            "longitude": parseFloat(longitude)
        }
        console.log("Ecco i dati della station " + JSON.stringify(stationData))
        console.log("Ecco data " + JSON.stringify(data))

        fetch('/api/users/' + localStorage.getItem('username') + '/stations?latitude=' + stationData['latitude'] + '&longitude=' + stationData['longitude'], {
            method: 'POST',
            headers: {
                'X-API-KEY' : localStorage.getItem('auth_token'),
            },
        }).then( (response) => {
            if(!response.ok) throw new Error(response.status);
            else {
                return response.text();
            }
        }).then( (res) => {
            console.log("Risposta data: " + res);
            window.location.reload(true);
        }).catch( (err) => {
            console.log(err.message);
        });
        console.log("finito richiesta");
    }

    return (
        <header style={styleBack}>
            <div>
                <NavBarComponent/>
                <br></br>
                <Container>
                    <div className="container">
                        <h3>
                            Stations
                            <Button className="m-3" variant="warning" size="lg" onClick={handleShow}>
                                +
                            </Button>
                                <Modal
                                    className="text-center"
                                    show={show}
                                    onHide={handleClose}
                                    backdrop="static"
                                    keyboard={false}
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title>Add new station</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        Please insert the necessary data:
                                        <Form>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>Latitude</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="es. 44.647129"
                                                    autofocus
                                                    onChange={event => setLatitude(event.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>Longitude</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="es. 10.925227"
                                                    onChange={event => setLongitude(event.target.value)}
                                                />
                                            </Form.Group>
                                        </Form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleClose}>
                                            Close
                                        </Button>
                                        <Button variant="primary" onClick={handleAddStation}>Add</Button>
                                    </Modal.Footer>
                                </Modal>
                        </h3>
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
