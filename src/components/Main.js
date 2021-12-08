import React, {Component} from 'react';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import EarlyLife from './TimelineContent/LifeNHell';
import TheSimpsons from './TimelineContent/TheSimpsons';
import TracyUlman from './TimelineContent/TracyUlman'
import Futurama from './TimelineContent/Futurama';
import Badge from 'react-bootstrap/Badge';
import '../stylesheets/App.css';

export default class Main extends Component {
    render() {
        return(
            <div className='main-content-wrapper'>
                <h1>Highlights</h1>
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                    <Row className="timeline-tabs">
                        <Col sm={3}>
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item>
                                    <Nav.Link eventKey="first">Early Life <Badge variant="primary" pill>
                                        1999
                                    </Badge></Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="second">The Tracey Ullman Show <Badge variant="primary" pill>
                                        1999
                                    </Badge></Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="third">The Simpsons <Badge variant="primary" pill>
                                        1999
                                    </Badge>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="fourth">Futurama <Badge variant="primary" pill>
                                        1999
                                    </Badge></Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="fifth">Disenchantment <Badge variant="primary" pill>
                                        1999
                                    </Badge></Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col sm={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="first">
                                    <EarlyLife />
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                    <TracyUlman />
                                </Tab.Pane>
                                <Tab.Pane eventKey="third">
                                    <TheSimpsons />
                                </Tab.Pane>
                                <Tab.Pane eventKey="fourth">
                                    <Futurama />
                                </Tab.Pane>
                                <Tab.Pane eventKey="fifth">
                                    <h2>Disenchantment</h2>
                                    <p>
                                        2018: Created Disenchantment, his first project with a serialized story format 
                                        serving a chronological narrative. This is Groening's first project to air on a 
                                        streaming service, Netflix.
                                    </p>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        );
    }
}
