import React, { Component } from 'react';
import './EditButton.css';
import Button from '@material-ui/core/Button';
import Form from 'react-bootstrap/Form';
import { changeUserImage } from "../../store/user/userActions";
import { uploadProfilePicture } from "../../util/apiCallFunctions";
import { ThemeProvider } from "@material-ui/core/styles";
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import customTheme from "../../styles/materialUiTheme";

export default class ChangeProfilePictureArea extends Component {

    render() {
        return (
            <div className="imageUpdateAreaContainer">
                <Form.Label>Profile Picture</Form.Label>

                <div className="imageUploadContainer">
                    <div className="colFlex">
                        <input type="file" id="changeProfilePictureUpload" hidden accept="image/*"
                            onChange={e => document.getElementById("profilePictureUploadPreview").src = URL.createObjectURL(e.target.files[0])} />
                        <label htmlFor="changeProfilePictureUpload">
                            <ThemeProvider theme={customTheme}>
                                <Button color="primary" aria-label="upload profile picture" component="span" variant="contained" startIcon={<PhotoCamera />}>
                                    Upload</Button>
                            </ThemeProvider>

                        </label>
                        <ThemeProvider theme={customTheme}>
                            <Button color="primary" variant="contained" startIcon={<SaveAltIcon />}
                                onClick={(e) => {
                                    e.preventDefault();
                                    uploadProfilePicture(document.getElementById("changeProfilePictureUpload").files[0]) // Send image to the server
                                        .then((imageFile) => changeUserImage(imageFile));
                                }}>Save</Button>
                        </ThemeProvider>
                    </div>
                    <img id="profilePictureUploadPreview" src={require(`../../images/uploads/${this.props.profilePic}`)} />

                    <div /> {/* Added a DOM element to center the image*/}
                </div>
            </div>
        );

    }

}
