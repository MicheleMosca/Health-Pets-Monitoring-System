import {React,useEffect,useState} from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import {ShowStations} from "../showStations";
import {ListGroup,Card} from 'react-bootstrap';

export default function Station(route)
{
    const navigate = useNavigate();
    const location = useLocation();  //ora in location.state.id trovo l'id della stazione 
    //const [latLong,setLatLong]=useState([]);
    const latLong=[];
    
    const [foods, setFoods] = useState([]);
    const [waters, setWaters] = useState([]);
    
    const handleBackButton = (e) => {
        e.preventDefault();
        console.log("Dentro handle back button");
        if(localStorage.length === 0)
            navigate("/");
        else
            navigate("/home"); 
    }

    useEffect(() => {
        fetch('/api/users/' + localStorage.getItem('username') + '/stations/' + location.state.id+ '/foods?limit=1',
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
                console.log("Ecco foods"+ JSON.stringify(foods));
            })
        
    }, [])

    useEffect(() => {
        fetch('/api/users/' + localStorage.getItem('username') + '/stations/' + location.state.id+ '/waters?limit=1',
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
                console.log("Ecco foods"+ JSON.stringify(foods));
            })
        
    }, [])


    const position=[location.state.latitude,location.state.longitude]

    return(
        <div className="text-center">
            <div className='text-left mt-3 ml-5'>
                <button className="text-right" type="button" class="btn btn-secondary" onClick={handleBackButton}>Back</button>
            </div>
            <h1 className="title home-page-title">Station #{location.state.id}</h1>
            <Card style={{}}>
                {/* <Card.Img variant="top" src="holder.js/100px180?text=Image cap" /> */}
                <ShowStations center={position} zoom = "18" />
                <Card.Body>
                    <Card.Title>Station data</Card.Title>
                    <Card.Text>
                    This is the levels of your station
                    </Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    <ListGroup.Item>FOOD: {/* foods.map(food => ( food.map( f => f.toUpperCase() )))*/}</ListGroup.Item>
                    <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                    <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                </ListGroup>
            </Card>

            <div>{JSON.stringify(foods)}</div> 
            <div>{JSON.stringify(waters)}</div>
           {/*  <ShowStations center={position} zoom = "18" /> */}
        </div>
    )
}
