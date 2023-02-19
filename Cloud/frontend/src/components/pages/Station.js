import {React,useEffect,useState, useLayoutEffect} from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import {ShowStations} from "../showStations";
import {ListGroup,Card, Table,Button } from 'react-bootstrap';
import {XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, LineSeries, LineMarkSeries} from 'react-vis';
import NavBarComponent from './NavBarComponent';
// import {curveCatmullRom} from 'd3-shape';
import { environment } from '../constants';

import { MDBDataTable } from 'mdbreact';

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

    var foodData = {
        columns: [
          {
            label: 'Data',
            field: 'timestamp',
            sort: 'asc',
            width: 150
          },
          {
            label: 'Value',
            field: 'value',
            sort: 'asc',
            width: 270
          }
        ],
        rows: foods
      };

      var waterData = {
        columns: [
          {
            label: 'Data',
            field: 'timestamp',
            sort: 'asc',
            width: 150
          },
          {
            label: 'Value',
            field: 'value',
            sort: 'asc',
            width: 270
          }
        ],
        rows: waters
      };


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
        fetch(environment.site+'/api/users/' + localStorage.getItem('username') + '/stations/' + location.state.id+ '/foods',
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
        fetch(environment.site+'/api/users/' + localStorage.getItem('username') + '/stations/' + location.state.id+ '/waters',
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
            <div className="container-fluid mt-5">

                    <Card style={{}}>
                        {/* <Card.Img variant="top" src="holder.js/100px180?text=Image cap" /> */}
                        <Card.Body>
                            <Card.Title>Station data</Card.Title>
                            <Card.Text>
                            This is the levels of your station
                            </Card.Text>
                        </Card.Body>
                        <div className="row row-cols-1 justify-content-center">
                        <Button className="btn-sm" variant="primary" onClick={handleToggle}>Show Table</Button>
                        </div>
                        { showTable?
                        <ListGroup className="list-group-flush" >
                            <ListGroup.Item>FOOD:
                            <MDBDataTable
                                scrollY
                                maxHeight="200px"
                                striped
                                bordered
                                small
                                data={foodData}
                            />

                            </ListGroup.Item>
                            <ListGroup.Item>WATER:
                            <MDBDataTable
                                scrollY
                                maxHeight="200px"
                                striped
                                bordered
                                small
                                data={waterData}
                            />

                            </ListGroup.Item>
                            {console.log("Foods vale "+ JSON.stringify(foods))}
                            {console.log("waters vale "+ JSON.stringify(waters))}
                            {console.log("foodDict vale "+ JSON.stringify(foodDict))}
                        </ListGroup>
                        : null}
                    </Card>

                <div className="row row-cols-1 row-cols-md-3 g-4 mt-2 justify-content-center">
                    <h3 className="mt-5">FOODS</h3>
                </div>
                <div className="row row-cols-1 row-cols-md-3 g-4 mt-2 justify-content-center">
                    <XYPlot width={width}  height={300} xType="time"><XAxis/><YAxis/>
                    <HorizontalGridLines />
                    <VerticalGridLines />
                    <LineMarkSeries data={foodDict} />
                    </XYPlot>
                </div>
                <div className="row row-cols-1 row-cols-md-3 g-4 mt-2 justify-content-center">
                    <h3 className="mt-5">WATER</h3>
                </div>
                <div className="row row-cols-1 row-cols-md-3 g-4 mt-2 justify-content-center">
                    <XYPlot width={width}  height={300} xType="time"><XAxis/><YAxis/>
                    <HorizontalGridLines />
                    <VerticalGridLines />
                    <LineMarkSeries data={waterDict}  />
                    </XYPlot>
                </div>
                <div className="row row-cols-1 row-cols-md-3 g-4 mt-2 justify-content-center">
                    <h3 className="mt-5">LOCATION</h3>
                </div>
                <ShowStations center={position} zoom = "18" station_id={location.state.id}/>
            </div>
        </div>
    )
}
