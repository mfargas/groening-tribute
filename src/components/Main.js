import React, {Component} from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';

export default class Main extends Component {
    render() {
        return(
            <div className='main-content-wrapper'>
                <h1>Life</h1>
                <ListGroup className='list'>
                    <ListGroup.Item>Early Life 
                        <Badge variant="primary" pill>
                            1999
                        </Badge>
                    </ListGroup.Item>
                    <ListGroup.Item>The Tracey Ullman Show
                        <Badge variant="primary" pill>
                            1999
                        </Badge>
                    </ListGroup.Item>
                    <ListGroup.Item>The Start of the Simpsons
                        <Badge variant="primary" pill>
                            1999
                        </Badge>
                    </ListGroup.Item>
                    <ListGroup.Item>Futurama
                        <Badge variant="primary" pill>
                            1999
                        </Badge>
                    </ListGroup.Item>
                    <ListGroup.Item>Disenchantment
                        <Badge variant="primary" pill>
                            1999
                        </Badge>
                    </ListGroup.Item>
                </ListGroup>
            </div>
        );
    }
}
