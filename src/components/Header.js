import React, {Component} from 'react';
import Carousel from 'react-bootstrap/Carousel';

export default class Header extends Component {
    render() {
    return(
        <div >
        <header className="App-header">
            <h1>Matthew Groening</h1>
        </header>
            <Carousel>
                <Carousel.Item>
                    <img
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
                    <img
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
        </div>
    )
    }
}
