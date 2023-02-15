import {React,useEffect,useState} from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import {ShowStations} from "../showStations";
import {ListGroup,Card,Button,Modal,ButtonGroup,ToggleButton} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

export default function Animal()
{
    const navigate = useNavigate();
    const location = useLocation();  //ora in location.state.id trovo l'id dell'animale'  e in location.state.station_id trovo l'id della stazione
    console.log("Ora in location.state ho " + JSON.stringify(location.state))
    //const [latLong,setLatLong]=useState([]);
    const latLong=[];
    
    const [animal, setAnimal] = useState();

    const [showAM, setShowAM] = useState(false);
    const handleCloseAM = () => setShowAM(false);
    const handleShowAM = () => setShowAM(true);

    const [meal_quantity, setMealQuantity] = useState/*int*/("");
    const [meal_time, setMealTime] = useState/*string*/("");
    const [meal_type, setMealType] = useState/*string*/("");
    const radios = [
        { name: 'Secco', value: 'secco' },
        { name: 'Umido', value: 'umido' },
      ];
    
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


    const handleAddMeal = (e) => {
        return
    }

    

    return(
        <div className="text-center">
            <div className='text-left mt-3 ml-5'>
                <button className="text-right" type="button" class="btn btn-secondary" onClick={handleBackButton}>Back</button>
            </div>
            <h1 className="title home-page-title">Animal #{animal?.name}</h1>
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
            <div>{JSON.stringify(animal)}</div>
            
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
                            {/* <ButtonGroup>
                                {radios.map((radio, idx) => (
                                <ToggleButton
                                    key={idx}
                                    id={`radio-${idx}`}
                                    type="radio"
                                    name="radio"
                                    variant="secondary"
                                    value={radio.value}
                                    checked={meal_type === radio.value}
                                    onChange={(e) => setMealType(e.currentTarget.value)}
                                >
                                    {radio.name}
                                </ToggleButton>
                                ))}
                            </ButtonGroup> */}
                            {/* <div class="form-check">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
                            <label class="form-check-label" for="flexRadioDefault1">
                                Default radio
                            </label>
                            </div>
                            <div class="form-check">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked>
                            <label class="form-check-label" for="flexRadioDefault2">
                                Default checked radio
                            </label>
                            </div> */}
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
            </div>

        </div>
    )
}