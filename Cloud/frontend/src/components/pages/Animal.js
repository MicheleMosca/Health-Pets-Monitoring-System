import {React,useEffect,useState} from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import {ShowStations} from "../showStations";
import {ListGroup,Card,Button,Modal,ButtonGroup,ToggleButton} from 'react-bootstrap';
import {XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, LineSeries, LineMarkSeries} from 'react-vis';
import Form from 'react-bootstrap/Form';
import NavBarComponent from "./NavBarComponent";

export default function Animal()
{
    const navigate = useNavigate();
    const location = useLocation();  //ora in location.state.id trovo l'id dell'animale'  e in location.state.station_id trovo l'id della stazione
    console.log("Ora in location.state ho " + JSON.stringify(location.state))
    //const [latLong,setLatLong]=useState([]);
    const latLong=[];
    
    const [animal, setAnimal] = useState();
    const [weights, setWeights] = useState();
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
    
    
    const handleBackButton = (e) => {
        e.preventDefault();
        console.log("Dentro handle back button");
        if(localStorage.length === 0)
            navigate("/");
        else
            navigate("/home"); 
    }

    useEffect(() => {
        fetch('/api/users/' + localStorage.getItem('username') + '/stations/' + location.state.station_id + '/animals/' + location.state.id,
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
           
        fetch('/api/users/' + localStorage.getItem('username') + '/stations/' + location.state.station_id + '/animals/' + location.state.id + '/weights/prediction', {
            method: 'GET',
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
            setWeights(res)

            //window.location.reload(true);
        }).catch( (err) => {
            console.log(err.message);
        });
        console.log("finito richiesta");
        
    }, [])

    useEffect(() => {

        fetch('/api/users/' + localStorage.getItem('username') + '/stations/' + location.state.station_id + '/animals/' + location.state.id + '/meals', {
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

    const handleAddMeal = (e) => {
        e.preventDefault();
        console.log("Dentro handle add station");

        const mealData = {
            "meal_quantity": meal_quantity,
            "meal_type": meal_type,
            "meal_time": meal_time
        }
        console.log("Ecco i dati del pasto " + JSON.stringify(mealData))

        fetch('/api/users/' + localStorage.getItem('username') + '/stations/' + location.state.station_id + '/animals/' + location.state.id + '/meals?meal_type=' + mealData["meal_type"] + '&quantity=' + mealData["meal_quantity"] + '&time=' + mealData["meal_time"], {
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


    function getMeals()
    {
        let html = [];

        for (let i = 0; i < meals?.length; i++)
        {
            html.push(
                <tr>
                    <th scope="row">{meals[i].id}</th>
                    <td>{meals[i].meal_type}</td>
                    <td>{meals[i].quantity}</td>
                    <td>{meals[i].time}</td>
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
            <Card style={{}}>
                {/* <Card.Img variant="top" src="holder.js/100px180?text=Image cap" /> */}
                {/* <ShowStations  /> */}
                <Card.Body>
                    <Card.Title>Animal data</Card.Title>
                    <Card.Text>
                    This is the info of your pet
                    </Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    <ListGroup.Item>NAME: {  animal?.name }</ListGroup.Item>
                    <ListGroup.Item>Type: {  animal?.animal_type }</ListGroup.Item>
                    <ListGroup.Item>Breed: {  animal?.breed }</ListGroup.Item>
                    <ListGroup.Item>Gender: {  animal?.gender }</ListGroup.Item>
                    <ListGroup.Item>Age: { animal?.age }</ListGroup.Item>
                    <ListGroup.Item>Bark: { animal?.bark? "true": "false" }</ListGroup.Item>
                    <ListGroup.Item>Temperature: { animal?.temperature }</ListGroup.Item>

                </ListGroup>
            </Card>
            {/*<div>{JSON.stringify(animal)}</div>*/}
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Meal Type</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Time</th>
                </tr>
                </thead>
                <tbody>
                {getMeals()}
                </tbody>
            </table>
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
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Quantity (grams)</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="es. 100"
                                    autoFocus
                                    onChange={event => setMealQuantity(event.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Meal type</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="secco/umido"
                                    onChange={event => setMealType(event.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Time</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="es. 17:00"
                                    onChange={event => setMealTime(event.target.value)}
                                />
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
                <Button className="m-3" variant="danger">Delete a meal</Button>
                

                <div>
                        <Button variant="primary" onClick={handleToggle}>Show Predict</Button>
                        { showChart ?
                        
                        <XYPlot width={1200}  height={300} xType="time" hidde><XAxis/><YAxis/>
                            <HorizontalGridLines />
                            <VerticalGridLines />
                            <LineMarkSeries  />
                        </XYPlot>
                        
                        : null }
                </div>
                
               

                
            </div>
        </div>
    )
}