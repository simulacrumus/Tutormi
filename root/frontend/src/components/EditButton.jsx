import React from 'react';
import '../styles/EditButton.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { connect } from "react-redux";
<<<<<<< HEAD
import {store} from '../store/configureStore.js';
=======
import {store} from '../configureStore.js';
>>>>>>> 8d43487be2fb3ac6eb896d9c872c4eb4e7c3344b
import {UPDATE_USER} from '../reducers/profileReducer.js';

function EditButton(props) {
    const [show, setShow] = React.useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <img className="editIcon" src={require("../images/edit-icon.png")} onClick={handleShow} ></img>
            <Modal show={show} onHide={handleClose} animation={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Information</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                    <Form.Group>
                        <Form.Label>Profile Picture</Form.Label>
                        <Form.Control type="text" defaultValue={props.user.imgPath} id="imgInput"/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" defaultValue={`${props.user.firstName} ${props.user.lastName}`} id="nameInput"/>
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>Bio</Form.Label>
                        <Form.Control as="textarea" rows="3" defaultValue={props.user.about} id="bioInput"/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Languages</Form.Label>
                        <Form.Control type="text" defaultValue={props.user.languages} id="languageInput"/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Location</Form.Label>
                        <Form.Control type="text" defaultValue={props.user.location} id="locationInput"/>
                    </Form.Group>

                    </Form>
                   
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => {
                        store.dispatch(
                            {type: UPDATE_USER, payload: {
                                imgPath: document.getElementById("imgInput").value,
                                firstName: document.getElementById("nameInput").value.split(" ")[0],
                                lastName: document.getElementById("nameInput").value.split(" ")[1],
                                about: document.getElementById("bioInput").value,
                                languages: document.getElementById("languageInput").value,
                                location: document.getElementById("locationInput").value,
                            }
                                });
                        handleClose();}}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    );

}

function mapStateToProps(state) {
    return {
        user: state.profileReducer.user
    };
}

export default connect(mapStateToProps)(EditButton);