import {React,useEffect,useState} from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import {ShowStations} from "../showStations";
import {ListGroup,Card} from 'react-bootstrap';

export default function Animal()
{
    const navigate = useNavigate();
    const location = useLocation();  //ora in location.state.id trovo l'id dell'animale'  e in location.state.station_id trovo l'id della stazione
    console.log("Ora in location.state ho " + JSON.stringify(location.state))
    //const [latLong,setLatLong]=useState([]);
    const latLong=[];
    
    const [animal, setAnimal] = useState();
    
    
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
        </div>
    )
}