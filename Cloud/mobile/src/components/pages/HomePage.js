import {React,useEffect} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { Button,Container,Row,Col } from 'react-bootstrap';
import NavBarComponent from './NavBarComponent'

export default function HomePage() {
    const navigate = useNavigate();

    useEffect(()=>{
        console.log("Sono dentro homepage e localstorage vale" + localStorage.getItem("authenticated"))
        if(localStorage.getItem("authenticated") !== 'true'){
            console.log("devo tornare in login")
            navigate("/login");
            console.log("fatto")
        }
      });

    return (
        <div>
            <NavBarComponent></NavBarComponent>
            <div className="text-center">
                <h1 className="main-title home-page-title">welcome to our app</h1>
               
                <br></br>
            <Container>
                <Row>
                <Col>1 of 2</Col>
                <Col>2 of 2</Col>
                </Row>
                <Row>
                <Col>1 of 3</Col>
                <Col>2 of 3</Col>
                <Col>3 of 3</Col>
                </Row>
            </Container>
            </div>
        </div>
        
    )
}
