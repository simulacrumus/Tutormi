import React from 'react';
import './EditButton.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { connect } from "react-redux";
import { store } from '../../store/configureStore.js';
import { USER_INFO_UPDATED } from '../../store/user/userActions';
import RemovableBox from './RemovableBox';
import AddBoxIcon from '@material-ui/icons/AddBox';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import TwitterIcon from '@material-ui/icons/Twitter';
import YouTubeIcon from '@material-ui/icons/YouTube';


function EditButton(props) {
    const [show, setShow] = React.useState(false);
    const [courses, setCourses] = React.useState(props.user.courses);
    const [languages, setLanguages] = React.useState(props.user.languages);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <img className="editIcon" src={require("../../images/edit-icon.png")} onClick={handleShow} ></img>
            <Modal show={show} onHide={handleClose} animation={false} centered >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Information</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Profile Picture</Form.Label>
                            <Form.Control type="text" defaultValue={props.user.imgPath} id="imgInput" />
                        </Form.Group>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" defaultValue={props.user.user.email} />
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" defaultValue={props.user.user.name} id="nameInput" />
                        </Form.Group>
                        <Form.Group >
                            <Form.Label>Bio</Form.Label>
                            <Form.Control as="textarea" rows="3" defaultValue={props.user.bio} id="bioInput" />
                        </Form.Group>


                        <Form.Label>Courses</Form.Label>
                        <div className="myAddInputRow">
                            <Form.Control id="courseInput" type="text" placeholder="Add a course" onChange={() => { }} />
                            <AddBoxIcon fontSize="large" className="editFormAddIcon" onClick={() => {
                                let updatedCourses = courses.slice();
                                updatedCourses.push(document.getElementById("courseInput").value);
                                setCourses(updatedCourses);
                            }} />
                        </div>
                        <div className="removableBoxHolder">
                            {courses.map((course) => <RemovableBox content={course} list={courses} setList={setCourses} />)}
                        </div>


                        <Form.Label>Languages</Form.Label>
                        <div className="myAddInputRow">
                            <Form.Control id="languageInput" type="text" placeholder="Add a language" onChange={() => { }} />
                            <AddBoxIcon fontSize="large" className="editFormAddIcon" onClick={() => {
                                let updatedLanguages = languages.slice();
                                updatedLanguages.push(document.getElementById("languageInput").value);
                                setLanguages(updatedLanguages);
                            }} />
                        </div>

                        <div id="languageEditSection" className="removableBoxHolder">
                            {languages.map((language) => <RemovableBox content={language} list={languages} setList={setLanguages} />)}
                        </div>

                        <Form.Group>
                            <Form.Label>Location</Form.Label>
                            <Form.Control type="text" defaultValue={props.user.location} id="locationInput" />
                        </Form.Group>



                        <Form.Label>Social Media</Form.Label>
                        <div className="myAddInputRow">
                            <LinkedInIcon className="editFormSocialIcon" fontSize="large" />
                            <Form.Control type="text" defaultValue={props.user.social.linkedin} id="linkedinInput" />
                        </div>
                        <div className="myAddInputRow">
                            <TwitterIcon className="editFormSocialIcon" fontSize="large" />
                            <Form.Control type="text" defaultValue={props.user.social.twitter} id="twitterInput" />
                        </div>
                        <div className="myAddInputRow">
                            <FacebookIcon className="editFormSocialIcon" fontSize="large" />
                            <Form.Control type="text" defaultValue={props.user.social.facebook} id="facebookInput" />
                        </div>
                        <div className="myAddInputRow">
                            <InstagramIcon className="editFormSocialIcon" fontSize="large" />
                            <Form.Control type="text" defaultValue={props.user.social.instagram} id="instagramInput" />
                        </div>
                        <div className="myAddInputRow">
                            <YouTubeIcon className="editFormSocialIcon" fontSize="large" />
                            <Form.Control type="text" defaultValue={props.user.social.youtube} id="youtubeInput" />
                        </div>
                    </Form>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="success" onClick={() => {
                        store.dispatch(
                            {
                                type: USER_INFO_UPDATED, payload: {
                                    imgPath: document.getElementById("imgInput").value,
                                    name: document.getElementById("nameInput").value,
                                    bio: document.getElementById("bioInput").value,
                                    languages: languages,
                                    location: document.getElementById("locationInput").value,
                                    courses: courses,
                                    social: {
                                        linkedin: document.getElementById("linkedinInput").value,
                                        twitter: document.getElementById("twitterInput").value,
                                        facebook: document.getElementById("facebookInput").value,
                                        instagram: document.getElementById("instagramInput").value,
                                        youtube: document.getElementById("youtubeInput").value
                                    }
                                }
                            });
                        handleClose();
                    }}>
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