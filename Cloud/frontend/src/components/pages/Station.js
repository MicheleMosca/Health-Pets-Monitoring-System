import {React,useEffect,useState} from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import {ShowStations} from "../showStations";
import {ListGroup,Card, Table} from 'react-bootstrap';

export default function Station()
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
        fetch('/api/users/' + localStorage.getItem('username') + '/stations/' + location.state.id+ '/foods?limit=3',
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
                console.log("myJSON ha tornato"+ JSON.stringify(myJson));
                setFoods(...foods, myJson);
                console.log("Ecco foods"+ JSON.stringify(foods));
            })
        
    }, [])

    useEffect(() => {
        fetch('/api/users/' + localStorage.getItem('username') + '/stations/' + location.state.id+ '/waters?limit=3',
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
                setWaters(...waters, myJson);
                console.log("Ecco waters"+ JSON.stringify(waters));
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
                    <ListGroup.Item>FOOD: 
                        
                    <Table striped>
                        <thead>
                            <tr>
                            <th>Time</th>
                            <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                        { foods.map(food => ( /*food.value*/
                            <tr>
                                <td>{food.timestamp}</td>
                                <td>{food.value}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>                      
                    
                    </ListGroup.Item>
                    <ListGroup.Item>WATER: 
                        <Table striped>
                            <thead>
                                <tr>
                                <th>Time</th>
                                <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                            { waters.map(water => ( /*food.value*/
                                <tr>
                                    <td>{water.timestamp}</td>
                                    <td>{water.value}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>           

                    </ListGroup.Item>
                    {console.log("Foods vale "+ JSON.stringify(foods))}
                    {console.log("waters vale "+ JSON.stringify(waters))}
                </ListGroup>
            </Card>

           {/*  <ShowStations center={position} zoom = "18" /> */}
        </div>
    )
}
