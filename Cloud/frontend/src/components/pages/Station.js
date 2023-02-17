import {React,useEffect,useState} from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import {ShowStations} from "../showStations";
import {ListGroup,Card, Table} from 'react-bootstrap';
//import { XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, LineSeries ,LineMarkSeries } from 'react-vis'
import {XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, LineSeries, LineMarkSeries} from 'react-vis';
// import {curveCatmullRom} from 'd3-shape';
import moment from 'moment';
export default function Station()
{
    const navigate = useNavigate();
    const location = useLocation();  //ora in location.state.id trovo l'id della stazione 
    //const [latLong,setLatLong]=useState([]);
    const latLong=[];

    const data = new Array(19).fill(0).reduce((prev, curr) => [...prev, {
        x: prev.slice(-1)[0].x + 1,
        y: prev.slice(-1)[0].y * (0.9 + Math.random() * 0.2) 
      }], [{x: 0, y: 10}]);
    
    const [foods, setFoods] = useState([]);
    const [waters, setWaters] = useState([]);
    const [foodDict,setFoodDict]=useState([]);
    const [waterDict,setWaterDict]=useState([]);
    
    const handleBackButton = (e) => {
        e.preventDefault();
        console.log("Dentro handle back button");
        if(localStorage.length === 0)
            navigate("/");
        else
            navigate("/home"); 
    }

    useEffect(() => {
        fetch('/api/users/' + localStorage.getItem('username') + '/stations/' + location.state.id+ '/foods?limit=10',
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
                    console.log("Data convertitaa momentt  "+ moment(myDate).format('l').toString() + " locale vale " + moment.locale() )
                    var newDay= new Date(moment(myDate).format('lll').toString())

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

                   // setFoodDict(foodDict => [...foodDict,{ x :  newDay   ,  y : level }])
                    level=0;
                    var m= moment(myDate).add(3,'days').format('lll')
                   

                    for(var i=0; i < 10 ; i++){
                        console.log("Sto Creando un nuovo giorno e vale "+ moment(myDate).add(9, 'hours').format('lll'))
                        m= moment(m).add(9, 'hours').format('lll').toString()
                        newDay= new Date(m)
                        
                        setFoodDict(foodDict => [...foodDict,{ x :  newDay  ,  y : level }])
                        level+=50;
                        if(level > 100)
                        level=0;
                    }
                }
                
                );
               
                console.log("Ecco foods"+ JSON.stringify(foods));
            })
        
    }, [])

    useEffect(() => {
        fetch('/api/users/' + localStorage.getItem('username') + '/stations/' + location.state.id+ '/waters?limit=10',
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
                    console.log("Sto aggiornando foodDict")
                    //setFoodDict(()...foodDict,{ x : item?.timestamp,  y : item?.value})  ;
                    var myDate = new Date(item?.timestamp);
                    console.log("Data convertitaa momentt  "+ moment(myDate).format('l').toString() + " locale vale " + moment.locale() )
                    var newDay= new Date(moment(myDate).format('lll').toString())

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

                    //setWaterDict(waterDict => [...waterDict,{ x :  newDay   ,  y : level }])
                    level=0;
                    var m= moment(myDate).add(3,'days').format('lll')
                   

                    for(var i=0; i < 10 ; i++){
                        console.log("Sto Creando un nuovo giorno e vale "+ moment(myDate).add(9, 'hours').format('lll'))
                        m= moment(m).add(9, 'hours').format('lll').toString()
                        newDay= new Date(m)
                        
                        setWaterDict(waterDict => [...waterDict,{ x :  newDay  ,  y : level }])
                        level+=50;
                        if(level > 100)
                        level=0;
                    }
                }
                
                );
               

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
                    {console.log("foodDict vale "+ JSON.stringify(foodDict))}
                    {/*createFoodDict()*/}
                    {/*JSON.stringify(foods)*/} <br></br>
                    {/*JSON.stringify(foodDict)*/}
                </ListGroup>
            </Card>

           {/*  <ShowStations center={position} zoom = "18" /> */}
          {/*  <XYPlot width={1000} height={1000}>
      <VerticalGridLines />
      <HorizontalGridLines />
      <XAxis />
      <YAxis />
     {/*  <LineMarkSeries
        className="linemark-series-example"
        style={{
          strokeWidth: '3px'
        }}
        lineStyle={{stroke: 'red'}}
        markStyle={{stroke: 'blue'}}
        data={[{x: 1, y: 10}, {x: 2, y: 5}, {x: 3, y: 15}]}
      /> */}
    


     {/* <LineMarkSeries
        className="linemark-series-example-2"
        curve={'curveMonotoneX'}
        data={foodDict} {[{x: 1, y: 11}, {x: 1.5, y: 29}, {x: 3, y: 7}]}
        style={{mark:{stroke: 'white'}}}
      />  }
    </XYPlot> */}
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
    <LineMarkSeries data={waterDict} />
    </XYPlot>

        </div>
    )
}
