import React, { Component } from "react";
import Carousel from 'react-bootstrap/Carousel'

import "./HomePage.css";

export default class HomePage extends Component {
    render() {
        return (
            <div className="homeDiv">
                <Carousel>
                    <Carousel.Item>
                        <img
                            className="homeImage"
                            src="https://wallpaperplay.com/walls/full/3/9/b/225452.jpg"
                            alt="First slide"
                        />
                        <Carousel.Caption>
                            <h3>First slide label</h3>
                            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="homeImage"
                            src="https://wallpaperplay.com/walls/full/3/9/b/225452.jpg"
                            alt="Third slide"
                        />

                        <Carousel.Caption>
                            <h3>Second slide label</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="homeImage"
                            src="https://wallpaperplay.com/walls/full/3/9/b/225452.jpg"
                            alt="Third slide"
                        />

                        <Carousel.Caption>
                            <h3>Third slide label</h3>
                            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </div>
        );
    }
}


