import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Header from './components/Header';
import Main from './components/Main';
import Carousel from 'react-bootstrap/Carousel';
import Image from 'react-bootstrap/Image';
import Footer from './components/Footer';
import './stylesheets/App.css';

function App() {
  return (
    <Container fluid>
      <Navbar className='navigation'>
        <Navbar.Brand href="#home">Matt Groening Tribute</Navbar.Brand>
        <Nav>
          <Nav.Link href="#gallery">Gallery</Nav.Link>
          <Nav.Link href="#life">Life</Nav.Link>
          <Nav.Link href="#resources">More</Nav.Link>
        </Nav>
      </Navbar>
      <Header className="header-wrapper" id="intro"/>
      <div className="main-wrapper">
        <Carousel id="gallery">
          <Carousel.Item>
            <Image
              className="d-block w-100"
              src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/esq090118groening001-el3-1534352997.jpg?crop=1xw:0.9998524420835178xh;center,top&resize=980:*"
              alt="First slide"
            />
            <Carousel.Caption bsPrefix>
              <h3>Matt Groening and characters</h3>
              <p>As the creator of multiple critically-acclaimed shows, the characters we have come to know and love came as a result.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <Image
              className="d-block w-100"
              src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/esq090118groening001-el3-1534352997.jpg?crop=1xw:0.9998524420835178xh;center,top&resize=980:*"
              alt="First slide"
            />
            <Carousel.Caption bsPrefix>
              <h3>Matt Groening and characters</h3>
              <p>As the creator of multiple critically-acclaimed shows, the characters we have come to know and love came as a result.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        <Main id="life" />
      </div>
      <div className="footer-wrapper">
        <Footer id="resources" />
      </div>
    </Container>
  );
}

export default App;
