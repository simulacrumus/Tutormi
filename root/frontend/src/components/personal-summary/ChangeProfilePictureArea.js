import React, { Component } from 'react';
import './EditButton.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { connect } from "react-redux";
import { changeUserImage } from "../../store/user/userActions";
import { uploadProfilePicture } from "../../util/apiCallFunctions";

export default class ChangeProfilePictureArea extends Component {

    render() {
        return (
            <>
                <Form.Label>Profile Picture</Form.Label>

                <div className="imageUploadContainer">
                    <input type="file" id="changeProfilePictureUpload" accept="image/*"
                        onChange={e => document.getElementById("profilePictureUploadPreview").src = URL.createObjectURL(e.target.files[0])} />

                    <button onClick={(e) => {
                        e.preventDefault();
                        uploadProfilePicture(document.getElementById("changeProfilePictureUpload").files[0]) // Send image to the server
                            .then((imageFile) => changeUserImage(imageFile));
                    }}>Save Profile Picture</button>

                    <img id="profilePictureUploadPreview" src={require(`../../images/uploads/${this.props.profilePic}`)}></img>
                </div>
            </>
        );

    }

}
