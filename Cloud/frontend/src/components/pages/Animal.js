import {React,useEffect,useState, useLayoutEffect} from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import {ShowStations} from "../showStations";
import {ListGroup,Card,Button,Modal,ButtonGroup,ToggleButton} from 'react-bootstrap';
import {XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, LineSeries, LineMarkSeries} from 'react-vis';
import Form from 'react-bootstrap/Form';
import NavBarComponent from "./NavBarComponent";
import { environment } from '../constants';
import dogImage from "../../assets/images/dog.jpg";
import catImage from "../../assets/images/cat.jpg";
import ModalContext from "react-bootstrap/ModalContext";

export default function Animal()
{
    const navigate = useNavigate();
    const location = useLocation();  //ora in location.state.id trovo l'id dell'animale'  e in location.state.station_id trovo l'id della stazione
    console.log("Ora in location.state ho " + JSON.stringify(location.state))
    //const [latLong,setLatLong]=useState([]);
    const latLong=[];
    
    const [animal, setAnimal] = useState();
    const [weights, setWeights] = useState([]);
    const [weightPredictDict,setWeightPredictDict] = useState([]);
    const [weightDict,setWeightDict] = useState([]);
    const [beatsDict,setBeatsDict] = useState([]);
    const[showChart, setShowChart]=useState(false)
    const handleToggle = () => {
        setShowChart((showChart) => !showChart);
      };

    const [meals, setMeals] = useState();

    const [showAM, setShowAM] = useState(false);
    const handleCloseAM = () => setShowAM(false);
    const handleShowAM = () => setShowAM(true);

    const [meal_quantity, setMealQuantity] = useState/*int*/("");
    const [meal_time, setMealTime] = useState/*string*/("");
    const [meal_type, setMealType] = useState/*string*/("");
    
    /*Validate Form*/
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

    const useWindowSize = () => {
        const [size, setSize] = useState([0, 0]);
        useLayoutEffect(() => {
            function updateSize() {
                if (window.innerWidth <= 1200)
                    setSize([window.innerWidth, window.innerHeight]);
                else
                {
                    setSize([1200, window.innerHeight]);
                }
            }
            window.addEventListener("resize", updateSize);
            updateSize();
            return () => window.removeEventListener("resize", updateSize);
        }, []);
        return size;
    };

    const [width, height] = useWindowSize();
    
    const handleBackButton = (e) => {
        e.preventDefault();
        console.log("Dentro handle back button");
        if(localStorage.length === 0)
            navigate("/");
        else
            navigate("/home"); 
    }

    useEffect(() => {
        fetch(environment.site+'/api/users/' + localStorage.getItem('username') + '/stations/' + location.state.station_id + '/animals/' + location.state.id,
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
                setAnimal(myJson);
                console.log("Ecco animals"+ JSON.stringify(animal));
            })
        
    }, [])

    useEffect(() => {
           
        fetch(environment.site+'/api/users/' + localStorage.getItem('username') + '/stations/' + location.state.station_id + '/animals/' + location.state.id + '/weights/prediction', {
            method: 'GET',
            headers: {
                'X-API-KEY' : localStorage.getItem('auth_token'),
                'Content-Type' : 'application/json'
            },
        }).then( (response) => {
            if(!response.ok) throw new Error(response.status);
            else {
                return response.json();
            }
        }).then( (res) => {
            console.log("Risposta data: " + res);
            setWeights(res)

            res.forEach(item => {
                console.log("Sto aggiornando waterDict")
                var myDate = new Date(item?.x);

                setWeightPredictDict(weightPredictDict => [...weightPredictDict,{ x :  myDate   ,  y : item?.y }])
               
            }
            
            );

            //window.location.reload(true);
        }).catch( (err) => {
            console.log(err.message);
        });
        console.log("finito richiesta");
        
    }, [])

    useEffect(() => {

        fetch(environment.site+'/api/users/' + localStorage.getItem('username') + '/stations/' + location.state.station_id + '/animals/' + location.state.id + '/weights', {
            method: 'GET',
            headers: {
                'X-API-KEY' : localStorage.getItem('auth_token'),
                'Content-Type' : 'application/json'
            },
        }).then( (response) => {
            if(!response.ok) throw new Error(response.status);
            else {
                return response.json();
            }
        }).then( (res) => {
            console.log("Risposta data: " + res);
            setWeights(res)

            res.forEach(item => {
                    console.log("Sto aggiornando waterDict")
                    var myDate = new Date(item?.timestamp);

                    setWeightDict(weightDict => [...weightDict,{ x :  myDate   ,  y : item?.value }])

                }

            );

            //window.location.reload(true);
        }).catch( (err) => {
            console.log(err.message);
        });
        console.log("finito richiesta");

    }, [])

    useEffect(() => {

        fetch(environment.site+'/api/users/' + localStorage.getItem('username') + '/stations/' + location.state.station_id + '/animals/' + location.state.id + '/beats', {
            method: 'GET',
            headers: {
                'X-API-KEY' : localStorage.getItem('auth_token'),
                'Content-Type' : 'application/json'
            },
        }).then( (response) => {
            if(!response.ok) throw new Error(response.status);
            else {
                return response.json();
            }
        }).then( (res) => {
            console.log("Risposta data: " + res);
            setWeights(res)

            res.forEach(item => {
                    console.log("Sto aggiornando waterDict")
                    var myDate = new Date(item?.timestamp);

                    setBeatsDict(beatsDict => [...beatsDict,{ x :  myDate   ,  y : item?.value }])

                }

            );

            //window.location.reload(true);
        }).catch( (err) => {
            console.log(err.message);
        });
        console.log("finito richiesta");

    }, [])

    useEffect(() => {

        fetch(environment.site+'/api/users/' + localStorage.getItem('username') + '/stations/' + location.state.station_id + '/animals/' + location.state.id + '/meals', {
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
            setMeals(myJson);
            console.log("Ecco meals"+ JSON.stringify(meals));
        })
    }, [animal])

    const validateAddMeal = () => {
        const { meal_quantity, meal_type, meal_time } = form;
        const newErrors = {}
        console.log(isNaN((parseInt(meal_quantity))))
        
        if((!meal_quantity) || (meal_quantity === ''))
        {
            newErrors.meal_quantity = "Please enter the meal quantity (grams)";
        }

        if(!meal_type || meal_type === '')
        {
            newErrors.meal_type = "Please enter the meal type (secco/umido)";
        }

        if(!meal_time || meal_time === '')
        {
            newErrors.meal_time = "Please enter the meal time";
        }

        if(Object.keys(newErrors).length > 0)
        {
            return newErrors;
        }

        if((isNaN(parseInt(meal_type)) === false))
        {
            newErrors.meal_type = "Invalid animal gender. Must be 'secco' or 'umido'";
        }

        if(isNaN(parseInt(meal_quantity)) === true)
        {
            newErrors.meal_quantity = "Invalid meal quantity";
        }

        if((meal_type.toUpperCase() !== 'SECCO') && (meal_type.toUpperCase() !== 'UMIDO'))
        {
            newErrors.meal_type = "Invalid animal gender. Must be 'secco' or 'umido'";
        }

        var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(meal_time);

        if (!isValid) {
            newErrors.meal_time = "Invalid time. The format must be 'HH:mm' (es. 12:00)";
        }

        console.log(newErrors);
        return newErrors;
    }

    const handleAddMeal = (e) => {
        e.preventDefault();
        console.log("Dentro handle add station");

        const mealData = {
            "meal_quantity": form.meal_quantity,
            "meal_type": form.meal_type,
            "meal_time": form.meal_time
        }
        console.log("Ecco i dati del pasto " + JSON.stringify(mealData))

        const formErrors = validateAddMeal();
        if(Object.keys(formErrors).length > 0)
        {
            setErrors(formErrors);
            return;
        }

        fetch(environment.site+'/api/users/' + localStorage.getItem('username') + '/stations/' + location.state.station_id + '/animals/' + location.state.id + '/meals?meal_type=' + mealData["meal_type"] + '&quantity=' + mealData["meal_quantity"] + '&time=' + mealData["meal_time"], {
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

    function deleteMeal(id)
    {
        fetch(environment.site+'/api/users/' + localStorage.getItem('username') + '/stations/' + location.state.station_id + '/animals/' + location.state.id + '/meals/' + id, {
            method: 'DELETE',
            headers:
                {
                    'X-API-KEY' : localStorage.getItem('auth_token'),
                    'Content-Type' : 'application/json'
                }
        }).then((response) => {
            if(!response.ok) throw new Error(response.status);
            return response.json();
        }).then((myJson) => {
            window.location.reload(false);
        })
    }

    function getMeals()
    {
        let html = [];

        for (let i = meals?.length -1 ; i >= 0; i--)
        {
            html.push(
                <tr>
                    <td>{meals[i].meal_type}</td>
                    <td>{meals[i].quantity}</td>
                    <td>{meals[i].time}</td>
                    <td><Button className="" variant="danger" size="sm" onClick={() => deleteMeal(meals[i].id)}>-</Button></td>
                </tr>
            )
        }

        return html;
    }

    return(
        <div className="text-center">
            <NavBarComponent/>
            <div className='text-left mt-3 ml-5'>
                <button className="text-right" type="button" class="btn btn-secondary" onClick={handleBackButton}>Back</button>
            </div>
            <h1 className="title home-page-title">{animal?.name}</h1>
            <div className="container-fluid mt-5">
                <div className="row row-cols-1 row-cols-md-3 g-4 mt-2 justify-content-center">
                    <div className="col-sm-6">
                        <div className="card mb-3 shadow bg-white rounded">
                            <div className="row card-body">
                                <div className="col-sm-6">
                                    <h5 className="card-title">Animal Data</h5>
                                    <p className="card-text">ID: {  animal?.id }</p>
                                    <p className="card-text">Type: {  animal?.animal_type }</p>
                                    <p className="card-text">Breed: {  animal?.breed }</p>
                                    <p className="card-text">Gender: {  animal?.gender }</p>
                                    <p className="card-text">Age: { animal?.age }</p>
                                    <p className="card-text">Bark: { animal?.bark? "true": "false" }</p>
                                    <p className="card-text">Temperature: { animal?.temperature } °C</p>
                                    <p className="card-text">Distance: { animal?.distance } m</p>
                                </div>
                                {animal?.animal_type === 'dog' ? <img className="col-sm-6" src={dogImage} alt="Station"/> : <img className="col-sm-6" src={catImage} alt="Station"/>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row row-cols-1 row-cols-md-3 g-4 mt-2 justify-content-center">
                    <h3>WEIGHT</h3>
                </div>
                <div className="row row-cols-1 row-cols-md-3 g-4 mt-2 justify-content-center">
                    <XYPlot width={width}  height={300} xType="time"><XAxis/><YAxis/>
                        <HorizontalGridLines />
                        <VerticalGridLines />
                        <LineMarkSeries data={weightDict} />
                    </XYPlot>
                </div>
                <div className="row row-cols-1 row-cols-md-3 g-4 mt-2 justify-content-center">
                    <h3>BEATS</h3>
                </div>
                <div className="row row-cols-1 row-cols-md-3 g-4 mt-2 justify-content-center">
                    <XYPlot width={width}  height={300} xType="time"><XAxis/><YAxis/>
                        <HorizontalGridLines />
                        <VerticalGridLines />
                        <LineMarkSeries data={beatsDict} />
                    </XYPlot>
                </div>
                <div className="row row-cols-1 row-cols-md-3 g-4 mt-2 justify-content-center">
                    <h3>MEALS</h3>
                </div>
                <div className="row row-cols-1 row-cols-md-3 g-4 mt-2 justify-content-center">
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th scope="col">Meal Type</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Time</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {getMeals()}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row row-cols-1 row-cols-md-3 g-4 mt-2 justify-content-center">
                    <div className = "buttons text-center">
                        <Button className="m-3" variant="primary" onClick={handleShowAM}>Add new meal</Button>
                        <Modal
                            className="text-center"
                            show={showAM}
                            onHide={handleCloseAM}
                            backdrop="static"
                            keyboard={false}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Add new meal</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Please insert the necessary data:
                                <Form>
                                    <Form.Group className="mb-3" controlId="meal_quantity">
                                        <Form.Label>Quantity (grams)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="es. 50"
                                            autoFocus
                                            value={form.meal_quantity}
                                            onChange={event => setField("meal_quantity", event.target.value)}
                                            isInvalid={!!errors.meal_quantity}
                                        ></Form.Control>
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.meal_quantity}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="meal_type">
                                        <Form.Label>Meal type</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="secco/umido"
                                            value={form.meal_type}
                                            onChange={event => setField("meal_type", event.target.value)}
                                            isInvalid={!!errors.meal_type}
                                        ></Form.Control>
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.meal_type}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="meal_time">
                                        <Form.Label>Time</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="es. 17:00"
                                            value={form.meal_time}
                                            onChange={event => setField("meal_time", event.target.value)}
                                            isInvalid={!!errors.meal_time}
                                        ></Form.Control>
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.meal_time}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseAM}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={handleAddMeal}>Add</Button>

                            </Modal.Footer>
                        </Modal>
                        <Button variant="success" onClick={handleToggle}>Show Predict</Button>
                        { showChart ?
                            <div>
                                <h3 className="mt-5">WEIGHT PREDICT</h3>
                                <XYPlot width={width}  height={300} xType="time" hidde><XAxis/><YAxis/>
                                    <HorizontalGridLines />
                                    <VerticalGridLines />
                                    <LineMarkSeries  data={weightPredictDict} />
                                </XYPlot>
                            </div>
                        : null }
                    </div>
                </div>
            </div>
        </div>
    )
}