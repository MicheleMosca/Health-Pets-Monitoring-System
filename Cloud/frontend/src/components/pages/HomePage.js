import {React, useEffect, useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { Button,Container,Row,Col,Modal,Form, Card } from 'react-bootstrap';
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
    
    /*Station's things*/
    const [address, setAddress] = useState/*string*/("");
    const [delete_station_id, setDeleteStationID] = useState/*int*/("");
    
    /*Animal's things*/
    const [name, setName] = useState/*string*/("");
    const [age, setAge] = useState/*int*/("");
    const [gender, setGender] = useState/*string*/("");
    const [animalType, setAnimalType] = useState/*string*/("");
    const [breed, setBreed] = useState/*string*/("");
    const [station_id, setStationID] = useState/*int*/("");
    const [remove_animal_station, setRemoveAnimalStation] = useState/*int*/("");
    const [remove_animal_id, setRemoveAnimalID] = useState/*int*/("");

    /*Form's things*/
    const [showFS, setShowFS] = useState(false);
    const [showA, setShowA] = useState(false);
    const [showSR, setShowSR] = useState(false);
    const [showRA, setShowRA] = useState(false);

    const handleCloseFS = () => setShowFS(false);
    const handleShowFS = () => setShowFS(true);
    const handleCloseA = () => setShowA(false);
    const handleShowA = () => setShowA(true);
    const handleCloseSR = () => setShowSR(false);
    const handleShowSR = () => setShowSR(true);
    const handleCloseRA = () => setShowRA(false);
    const handleShowRA = () => setShowRA(true);

    function goToStation( station){
        console.log("Hai cliccato e mi hai passto questo id " +JSON.stringify(station))
        const stat={ id:station['id'],latitude:station['latitude'],longitude:station['longitude']}
        navigate("/station",{state:stat})
    } 
    function goToAnimal( animal){
        console.log("Hai cliccato e mi hai passto questo id " +JSON.stringify(animal))
        const stat={ id:animal['id'],station_id:animal['station_id']}
        navigate("/animal",{state:stat})
    } 
 

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
        header: {
            /*backgroundImage: `url(${BackgroundImage})`,*/
            backgroundPosition: "25% - 25%",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover"
        },

        content: {
            backgroundColor: 'rgba(0, 0, 0, 0.05)'
        }
    }



    function getStations()
    {
        const html = [];
        for (let i = 0; i < stations?.length; i++)
        {
            html.push(
                <div className="col"  >
                    
                    <div className="card mb-3 shadow bg-white rounded" style={styleCard}  >
                    
                    <Card  onClick={() => goToStation(stations[i])} style={{ cursor: "pointer" }} >
                        <img className="card-img-top" src={homeImage} alt="Station"/>
                        <div className="card-body">
                            <h5 className="card-title text-center"> Station #{stations[i]['id']} </h5>
                            <br/>
                            <h5 className="card-text"> Food Level: {foods[i]?.map(food => (food['value'].toUpperCase()))} </h5>
                            <h5 className="card-text"> Water Level: {waters[i]?.map(water => (water['value'].toUpperCase()))} </h5>
                        </div>
                       {/*  <Button  > vai</Button> */}
                    </Card>
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
                            <Card onClick={() => goToAnimal(animalArray[i])} style={{ cursor: "pointer" }}>
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
                            </Card>
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
            "address": address
        }
        console.log("Ecco i dati della station " + JSON.stringify(stationData))

        fetch('/api/users/' + localStorage.getItem('username') + '/stations?address=' + stationData['address'], {
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
            // this.forceUpdate();
        }).catch( (err) => {
            console.log(err.message);
        });
        console.log("finito richiesta");
    }

    const handleAddAnimal = (e) => {
        e.preventDefault();
        console.log("Dentro handle add station");

        const animalData = {
            "name": name,
            "age": parseInt(age),
            "gender": gender,
            "animal_type": animalType,
            "breed": breed,
            "station_id": station_id
        }
        console.log("Ecco i dati dell'animale " + JSON.stringify(animalData))

        fetch('/api/users/' + localStorage.getItem('username') + '/stations/' + animalData['station_id'] + '/animals?name=' + animalData['name'] + '&age=' + animalData['age'] + '&gender=' + animalData['gender'] + '&animal_type=' + animalData['animal_type'] + '&breed=' + animalData['breed'], {
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
            //this.forceUpdate();
        }).catch( (err) => {
            console.log(err.message);
        });
        console.log("finito richiesta");
    }

    const handleRemoveStation = (e) => {
        e.preventDefault();
        console.log("Dentro handle remove station");
    
        const stationData = {
            "station_id": parseInt(delete_station_id)
        }
        console.log("Ecco i dati della station " + JSON.stringify(stationData))

        fetch('/api/users/' + localStorage.getItem('username') + '/stations/' + stationData["station_id"], {
            method: 'DELETE',
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
            //this.forceUpdate();
        }).catch( (err) => {
            console.log(err.message);
        });
        console.log("finito richiesta");
    }

    const handleRemoveAnimal = (e) => {
        e.preventDefault();
        console.log("Dentro handle add station");

        const animalData = {
            "station_id": remove_animal_station,
            "animal_id": remove_animal_id
        }
        console.log("Ecco i dati dell'animale " + JSON.stringify(animalData))

        fetch('/api/users/' + localStorage.getItem('username') + '/stations/' + animalData['station_id'] + '/animals/' + animalData["animal_id"], {
            method: 'DELETE',
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
            //this.forceUpdate();
        }).catch( (err) => {
            console.log(err.message);
        });
        console.log("finito richiesta");
    }

    return (
        <header style={styleBack.header}>
            <div style={styleBack.content}>
                <NavBarComponent/>
                <br></br>
                <Container>
                    <div className="container">
                        <h3>
                            Stations
                            <Button className="m-3" variant="warning" size="lg" onClick={handleShowFS}>
                                +
                            </Button>
                                <Modal
                                    className="text-center"
                                    show={showFS}
                                    onHide={handleCloseFS}
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
                                                <Form.Label>Address</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="es. via Emilia Est, 456, Modena, Italia"
                                                    autoFocus
                                                    onChange={event => setAddress(event.target.value)}
                                                />
                                            </Form.Group>
                                        </Form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleCloseFS}>
                                            Close
                                        </Button>
                                        <Button variant="primary" onClick={handleAddStation}>Add</Button>
                                    </Modal.Footer>
                                </Modal>
                                <Button className="m-1" variant="danger" size="lg" onClick={handleShowSR}>
                                --
                                </Button>
                                <Modal
                                    className="text-center"
                                    show={showSR}
                                    onHide={handleCloseSR}
                                    backdrop="static"
                                    keyboard={false}
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title>Remove a station</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        Please insert the necessary data:
                                        <Form>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>Station ID</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="es. 4"
                                                    autoFocus
                                                    onChange={event => setDeleteStationID(event.target.value)}
                                                />
                                            </Form.Group>
                                        </Form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleCloseSR}>Close</Button>
                                        <Button variant="danger" onClick={handleRemoveStation}>Remove</Button>
                                    </Modal.Footer>
                                </Modal>
                        </h3>
                        <div className="row row-cols-1 row-cols-md-3 g-4 mt-2">
                            {getStations()}
                        </div>
                    </div>
                    <br/>
                    <div className="container">
                        <div>
                        <h3>
                            Animals
                            <Button className="m-3" variant="warning" size="lg" onClick={handleShowA}>
                                +
                            </Button>
                                <Modal
                                    className="text-center"
                                    show={showA}
                                    onHide={handleCloseA}
                                    backdrop="static"
                                    keyboard={false}
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title>Add new animal</Modal.Title>
                                       {/*  <Button variant="light"> X</Button> */}
                                    </Modal.Header>
                                    <Modal.Body>
                                        Please insert the necessary data:
                                        <Form>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="es. Mariangiongiangela"
                                                    autoFocus
                                                    onChange={event => setName(event.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>Age</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="es. 3"
                                                    onChange={event => setAge(event.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>Gender</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="M/F"
                                                    onChange={event => setGender(event.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>Type</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="dog/cat"
                                                    onChange={event => setAnimalType(event.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>Breed</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="es. German Shepherd"
                                                    onChange={event => setBreed(event.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>Station ID</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="es. 5"
                                                    onChange={event => setStationID(event.target.value)}
                                                />
                                            </Form.Group>
                                        </Form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleCloseA}>
                                            Close
                                        </Button>
                                        <Button variant="primary" onClick={handleAddAnimal}>Add</Button>
                                    </Modal.Footer>
                                </Modal>
                                <Button className="m-1" variant="danger" size="lg" onClick={handleShowRA}>
                                --
                                </Button>
                                <Modal
                                    className="text-center"
                                    show={showRA}
                                    onHide={handleCloseRA}
                                    backdrop="static"
                                    keyboard={false}
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title>Remove an animal</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        Please insert the necessary data:
                                        <Form>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>Station ID</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="es. 7"
                                                    autoFocus
                                                    onChange={event => setRemoveAnimalStation(event.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>Animal ID</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="es. 3"
                                                    onChange={event => setRemoveAnimalID(event.target.value)}
                                                />
                                            </Form.Group>
                                        </Form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleCloseRA}>
                                            Close
                                        </Button>
                                        <Button variant="danger" onClick={handleRemoveAnimal}>Remove</Button>
                                    </Modal.Footer>
                                </Modal>
                        </h3>
                        </div>
                        <div className="row row-cols-1 row-cols-md-3 g-4 mt-2">
                            {getAnimals()}
                        </div>
                    </div>
                </Container>
            </div>
        </header>
    )
}
