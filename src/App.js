import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './stylesheets/App.css';

function App() {
  return (
    <Container fluid>
      <Navbar.Brand href="#home">Matt Groening Tribute</Navbar.Brand>
      <Nav className="me-auto">
        <Nav.Link href="#home">Gallery</Nav.Link>
        <Nav.Link href="#link">Life</Nav.Link>
        <Nav.Link href="#resources">More</Nav.Link>
      </Nav>
      <div className="header-wrapper">
        <Header />
      </div>
      <div className="main-wrapper">
        <Main />
      </div>
      <div className="footer-wrapper">
        <Footer />
      </div>
    </Container>
  );
}

export default App;
