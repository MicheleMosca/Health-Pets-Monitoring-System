import {React, useEffect, useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { Button,Container,Row,Col,Modal,Form, Card } from 'react-bootstrap';
import NavBarComponent from './NavBarComponent';
import homeImage from "../../assets/images/home.jpg";
import dogImage from "../../assets/images/dog.jpg";
import catImage from "../../assets/images/cat.jpg";
import BackgroundImage from '../../assets/images/pattern.png'

export default function HomePage() {
    const navigate = useNavigate();
    const [stations, setStations] = useState();
    const [animals, setAnimals] = useState([]);
    const [foods, setFoods] = useState([]);
    const [waters, setWaters] = useState([]);
    const [beats, setBeats] = useState([]);
    
    /*Station's things*/
    const [address, setAddress] = useState/*string*/("");
    
    /*Animal's things*/
    const [name, setName] = useState/*string*/("");
    const [age, setAge] = useState/*int*/("");
    const [gender, setGender] = useState/*string*/("");
    const [animalType, setAnimalType] = useState/*string*/("");
    const [breed, setBreed] = useState/*string*/("");
    const [station_id, setStationID] = useState/*int*/("");

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
            backgroundImage: `url(${BackgroundImage})`,
            backgroundPosition: "0% - 0%",
            backgroundRepeat: "repeat",
            backgroundSize: "contain"
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


    const validateAddStation = () => {
        const { station_address } = form;
        const newErrors = {}
        console.log("Dentro validate add station");
        if(!station_address || station_address === '')
        {
            newErrors.station_address = "Please enter the station address";
            return newErrors;
        }

        console.log(newErrors);
        return newErrors;
    }


    const handleAddStation = (e) => {
        e.preventDefault();
        console.log("Dentro handle add station");

        const stationData = {
            "address": form.station_address
        }
        console.log("Ecco i dati della station " + JSON.stringify(stationData))

        const formErrors = validateAddStation();
        if(Object.keys(formErrors).length > 0)
        {
            setErrors(formErrors);
            return;
        }

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
            setErrors({station_address: "Invalid address"});
        });
        console.log("finito richiesta");
    }

    
    const validateAddAnimal = () => {
        const { animal_name, animal_age, animal_gender, animal_type, animal_breed, animal_station_id } = form;
        const newErrors = {}
        console.log(isNaN((parseInt(animal_name))))
        if(!animal_name || animal_name === '')
        {
            newErrors.animal_name = "Please enter the animal name";
        }
        
        if((!animal_age) || (animal_age === '') || (isNaN(parseInt(animal_age)) === true))
        {
            newErrors.animal_age = "Please enter the animal age";
        }

        if(!animal_gender || animal_gender === '')
        {
            newErrors.animal_gender = "Please enter the animal gender";
        }

        if(!animal_type || animal_type === '')
        {
            newErrors.animal_type = "Please enter the animal type";
        }

        if(!animal_breed || animal_breed === '')
        {
            newErrors.animal_breed = "Please enter the animal breed";
        }

        if((!animal_station_id) || (animal_station_id === '') || (parseInt(animal_station_id) === NaN))
        {
            newErrors.animal_station_id = "Please enter the animal station ID";
        }

        if(Object.keys(newErrors).length > 0)
        {
            return newErrors;
        }

        const id = parseInt(animal_station_id);

        for(let i = 0; i < stations?.length; i++)
        {
            if(id === stations[i]["id"])
            {
                break;
            }
            if(i === (stations?.length - 1))
            {
                newErrors.animal_station_id = "Station ID not found";
            }
        }

        if((isNaN(parseInt(animal_name)) === false))
        {
            newErrors.animal_name = "Invalid animal breed";
        }


        if((isNaN(parseInt(animal_breed)) === false))
        {
            newErrors.animal_breed = "Invalid animal breed";
        }

        if((animal_gender.toUpperCase() !== 'M') && (animal_gender.toUpperCase() !== 'F'))
        {
            newErrors.animal_gender = "Invalid animal gender. Must be M or F";
        }

        if((animal_type.toUpperCase() !== 'DOG') && (animal_type.toUpperCase() !== 'CAT'))
        {
            newErrors.animal_type = "Invalid animal type. Must be dog or cat";
        }
        console.log(newErrors);
        return newErrors;
    }

    //console.log("valore: " + parseInt("ciao"));

    const handleAddAnimal = (e) => {
        e.preventDefault();
        console.log("Dentro handle add station");

        const animalData = {
            "name": form.animal_name,
            "age": parseInt(form.animal_age),
            "gender": form.animal_gender,
            "animal_type": form.animal_type,
            "breed": form.animal_breed,
            "station_id": parseInt(form.animal_station_id)
        }
        console.log("Ecco i dati dell'animale " + JSON.stringify(animalData))

        const formErrors = validateAddAnimal();
        if(Object.keys(formErrors).length > 0)
        {
            setErrors(formErrors);
            return;
        }

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

    const validateIDStationRemove = () => {
        const { removeStationID } = form;
        const newErrors = {}

        if(!removeStationID || removeStationID === '')
        {
            newErrors.removeStationID = "Please enter the station ID";
            return newErrors;
        }
        
        const id = parseInt(removeStationID);

        for(let i = 0; i < stations?.length; i++)
        {
            if(id === stations[i]["id"])
            {
                break;
            }
            if(i === (stations?.length - 1))
            {
                newErrors.removeStationID = "ID not found";
            }
        }

        console.log(newErrors);
        return newErrors;
    }

    const handleRemoveStation = (e) => {
        e.preventDefault();
        console.log("Dentro handle remove station");

        const stationData = {
            "station_id": parseInt(form.removeStationID)
        }
        console.log("Ecco i dati della station " + JSON.stringify(stationData))

        const formErrors = validateIDStationRemove();
        if(Object.keys(formErrors).length > 0)
        {
            setErrors(formErrors);
            return;
        }

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


    const validateIDAnimalRemove = () => {
        const { removeAnimalStationID, removeAnimalID } = form;
        const newErrors = {}

        console.log("Valore " + removeAnimalStationID);
        console.log(typeof(removeAnimalStationID));
        console.log("Valore " + removeAnimalID);

        if((removeAnimalStationID === undefined && removeAnimalID === undefined) || (removeAnimalStationID === '' && removeAnimalID === ''))
        {
            newErrors.removeAnimalStationID = "Please enter the station ID";
            newErrors.removeAnimalID = "Please enter the animal ID";
            return newErrors;
        }
        
        if(removeAnimalStationID === undefined || removeAnimalStationID === '')
        {
            newErrors.removeAnimalStationID = "Please enter the station ID";
            return newErrors;
        }

        if(removeAnimalID === undefined || removeAnimalID === '')
        {
            newErrors.removeAnimalID = "Please enter the animal ID";
            return newErrors;
        }

        const station_id = removeAnimalStationID;
        const animal_id = parseInt(removeAnimalID);
        
        animals?.map( animalArray => {
            for(let i = 0; i < animalArray.length; i++)
            {
                if(station_id === animalArray[i]["station_id"] && animal_id === animalArray[i]["id"])
                {
                    break;
                }
                if(i === (animalArray.length - 1))
                {
                    newErrors.removeAnimalStationID = "Station ID or animal ID not found";
                    newErrors.removeAnimalID = "Station ID or animal ID not found";
                }
            }
        });

        console.log(newErrors);
        return newErrors;
    }


    const handleRemoveAnimal = (e) => {
        e.preventDefault();
        console.log("Dentro handle add station");

        const animalData = {
            "station_id": form.removeAnimalStationID,
            "animal_id": form.removeAnimalID
        }
        
        const formErrors = validateIDAnimalRemove();
        if(Object.keys(formErrors).length > 0)
        {
            setErrors(formErrors);
            return;
        }

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
                                            <Form.Group className="mb-3" controlId="station_address">
                                                <Form.Label>Address</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="es. via Emilia Ovest, 456, Modena, Italia"
                                                    autoFocus
                                                    value={form.station_address}
                                                    onChange={event => setField("station_address", event.target.value)}
                                                    isInvalid={!!errors.station_address}
                                                ></Form.Control>
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.station_address}
                                                </Form.Control.Feedback>
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
                                            <Form.Group className="mb-3" controlId="removeStationID">
                                                <Form.Label>Station ID</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="es. 4"
                                                    autoFocus
                                                    value={form.removeStationID}
                                                    onChange={event => setField("removeStationID", event.target.value)}
                                                    isInvalid={!!errors.removeStationID}
                                                ></Form.Control>
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.removeStationID}
                                                </Form.Control.Feedback>
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
                                    </Modal.Header>
                                    <Modal.Body>
                                        Please insert the necessary data:
                                        <Form>
                                            <Form.Group className="mb-3" controlId="animal_name">
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="es. Mariangiongiangela"
                                                    autoFocus
                                                    value={form.animal_name}
                                                    onChange={event => setField("animal_name", event.target.value)}
                                                    isInvalid={!!errors.animal_name}
                                                ></Form.Control>
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.animal_name}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="animal_age">
                                                <Form.Label>Age</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="es. 4"
                                                    autoFocus
                                                    value={form.animal_age}
                                                    onChange={event => setField("animal_age", event.target.value)}
                                                    isInvalid={!!errors.animal_age}
                                                ></Form.Control>
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.animal_age}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="animal_gender">
                                                <Form.Label>Gender</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="M/F"
                                                    autoFocus
                                                    value={form.animal_gender}
                                                    onChange={event => setField("animal_gender", event.target.value)}
                                                    isInvalid={!!errors.animal_gender}
                                                ></Form.Control>
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.animal_gender}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="animal_type">
                                                <Form.Label>Type</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="dog/cat"
                                                    autoFocus
                                                    value={form.animal_type}
                                                    onChange={event => setField("animal_type", event.target.value)}
                                                    isInvalid={!!errors.animal_type}
                                                ></Form.Control>
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.animal_type}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="animal_breed">
                                                <Form.Label>Breed</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="es. German Shepherd"
                                                    autoFocus
                                                    value={form.animal_breed}
                                                    onChange={event => setField("animal_breed", event.target.value)}
                                                    isInvalid={!!errors.animal_breed}
                                                ></Form.Control>
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.animal_breed}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="animal_station_id">
                                                <Form.Label>Station ID</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="es. 5"
                                                    autoFocus
                                                    value={form.animal_station_id}
                                                    onChange={event => setField("animal_station_id", event.target.value)}
                                                    isInvalid={!!errors.animal_station_id}
                                                ></Form.Control>
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.animal_station_id}
                                                </Form.Control.Feedback>
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
                                            <Form.Group className="mb-3" controlId="removeAnimalStationID">
                                            <Form.Label>Station ID</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="es. 4"
                                                    autoFocus
                                                    value={form.removeAnimalStationID}
                                                    onChange={event => setField("removeAnimalStationID", event.target.value)}
                                                    isInvalid={!!errors.removeAnimalStationID}
                                                ></Form.Control>
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.removeAnimalStationID}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="removeAnimalID">
                                                <Form.Label>Animal ID</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="es. 4"
                                                    autoFocus
                                                    value={form.removeAnimalID}
                                                    onChange={event => setField("removeAnimalID", event.target.value)}
                                                    isInvalid={!!errors.removeAnimalID}
                                                ></Form.Control>
                                                <Form.Control.Feedback type='invalid'>
                                                    {errors.removeAnimalID}
                                                </Form.Control.Feedback>
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
