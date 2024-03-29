import {React,useEffect,useState} from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import {ShowStations} from "../showStations";
import {ListGroup,Card, Table,Button } from 'react-bootstrap';
import {XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, LineSeries, LineMarkSeries} from 'react-vis';
import NavBarComponent from './NavBarComponent';
// import {curveCatmullRom} from 'd3-shape';
import { environment } from '../constants';

export default function Station()
{
    const navigate = useNavigate();
    const location = useLocation();  //ora in location.state.id trovo l'id della stazione 
    //const [latLong,setLatLong]=useState([]);
    const latLong=[];
    
    const [foods, setFoods] = useState([]);
    const [waters, setWaters] = useState([]);
    const [foodDict,setFoodDict]=useState([]);
    const [waterDict,setWaterDict]=useState([]);

    const [showTable,setShowTable]=useState(false)
    const handleToggle = () => {
        setShowTable((showTable) => !showTable);
      };
    
    const handleBackButton = (e) => {
        e.preventDefault();
        console.log("Dentro handle back button");
        if(localStorage.length === 0)
            navigate("/");
        else
            navigate("/home"); 
    }

    useEffect(() => {
        fetch(environment.site+'/api/users/' + localStorage.getItem('username') + '/stations/' + location.state.id+ '/foods?limit=10',
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
                myJson.forEach(item => {
                    console.log("Sto aggiornando foodDict")
                    //setFoodDict(()...foodDict,{ x : item?.timestamp,  y : item?.value})  ;
                    var myDate = new Date(item?.timestamp);
                    var level=0;
                    if(item?.value ==='low'){
                        level=0;
                    }
                    if(item?.value ==='medium'){
                        level=50;
                    }
                    if(item?.value ==='high'){
                        level=100;
                    }

                    setFoodDict(foodDict => [...foodDict,{ x :  myDate   ,  y : level }])                 

                }
                
                );
               
                console.log("Ecco foods"+ JSON.stringify(foods));
            })
        
    }, [])

    useEffect(() => {
        fetch(environment.site+'/api/users/' + localStorage.getItem('username') + '/stations/' + location.state.id+ '/waters?limit=10',
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

                myJson.forEach(item => {
                    console.log("Sto aggiornando waterDict")
                    var myDate = new Date(item?.timestamp);
                    var level=0;
                    if(item?.value ==='low'){
                        level=0;
                    }
                    if(item?.value ==='medium'){
                        level=50;
                    }
                    if(item?.value ==='high'){
                        level=100;
                    }

                    setWaterDict(waterDict => [...waterDict,{ x :  myDate   ,  y : level }])                  
                   
                }
                
                );
               

            })
        
    }, [])



    const position=[location.state.latitude,location.state.longitude]

    return(
        <div className="text-center">
            <NavBarComponent/>
            <div className='text-left mt-3 ml-5'>
                <button className="text-right" type="button" class="btn btn-secondary" onClick={handleBackButton}>Back</button>
            </div>
            <h1 className="title home-page-title">Station #{location.state.id}</h1>
            <Card style={{}}>
                {/* <Card.Img variant="top" src="holder.js/100px180?text=Image cap" /> */}
                <Card.Body>
                    <Card.Title>Station data</Card.Title>
                    <Card.Text>
                    This is the levels of your station
                    </Card.Text>
                </Card.Body>
                <Button variant="primary" onClick={handleToggle}>Show Table</Button>
                { showTable? 
                <ListGroup className="list-group-flush" >
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
                    {console.log("foodDict vale "+ JSON.stringify(foodDict))}
                </ListGroup>
                : null}
            </Card>

            FOODS: <br></br>
            <XYPlot width={1200}  height={300} xType="time"><XAxis/><YAxis/>
            <HorizontalGridLines />
            <VerticalGridLines />
            <LineMarkSeries data={foodDict} />
            </XYPlot>

            WATERS: <br></br>
            <XYPlot width={1200}  height={300} xType="time"><XAxis/><YAxis/>
            <HorizontalGridLines />
            <VerticalGridLines />
            <LineMarkSeries data={waterDict}  />
            </XYPlot>
            <ShowStations center={position} zoom = "18" station_id={location.state.id}/>
        </div>
    )
}
