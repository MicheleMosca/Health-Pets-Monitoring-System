import {Container,Nav,Navbar,NavDropdown} from 'react-bootstrap';
import { Link,useNavigate } from 'react-router-dom'

export default function NavBarComponent() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/home">HPMS</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/allStations">All Stations</Nav.Link>
            {/*<Nav.Link href="#pricing">Pricing</Nav.Link>*/}
            {/*<NavDropdown title="Dropdown" id="collasible-nav-dropdown">*/}
            {/*  <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>*/}
            {/*  <NavDropdown.Item href="#action/3.2">*/}
            {/*    Another action*/}
            {/*  </NavDropdown.Item>*/}
            {/*  <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>*/}
            {/*  <NavDropdown.Divider />*/}
            {/*  <NavDropdown.Item href="#action/3.4">*/}
            {/*    Separated link*/}
            {/*  </NavDropdown.Item>*/}
            {/*</NavDropdown>*/}
          </Nav>
         
          
        </Navbar.Collapse>
        <Nav className="justify-content-end">
            {/*<Nav.Link href="#deets">More deets</Nav.Link>*/}
            <Nav.Link eventKey={2} href="/login"> Logout {/* <Link to="/login">Log out</Link> */}</Nav.Link>
           
          </Nav>
      </Container>
    </Navbar>
  );
}
