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
              <Nav.Link href="https://t.me/HealthPetsMonitoringSystem_bot" target="_blank">Telegram Bot</Nav.Link>
          </Nav>
            <Nav className="justify-content-end">
            <Nav.Link eventKey={2} href="/login"> Logout {/* <Link to="/login">Log out</Link> */}</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
