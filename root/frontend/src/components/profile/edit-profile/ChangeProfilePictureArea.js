import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Form from 'react-bootstrap/Form';
import { changeUserImage, changeUserCoverImage } from "../../../store/user/userActions";
import { uploadProfilePicture, uploadCoverPicture } from "../../../util/apiCallFunctions";
import { isProfileSetUp } from "../../../util/authenticationFunctions";
import { ThemeProvider } from "@material-ui/core/styles";
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import customTheme from "../../../styles/materialUiTheme";
import ProfileImageArea from "../ProfileImagesArea";

export default class ChangeProfilePictureArea extends Component {

    state = {
        profilePic: this.props.profilePic,
        coverPic: this.props.coverPic,
        updatedProfilePic: false,
        updatedCoverPic: false
    }

    render() {
        console.log(this.state)
        return (
            <div className="imageUpdateAreaContainer">
                <Form.Label>Profile Images</Form.Label>

                <div className="imageUploadContainer">

                    <div className="imageUploadButtons">
                        <h6>Profile Picture</h6>
                        <input type="file" id="changeProfilePictureUpload" hidden accept="image/*"
                            onChange={e => {
                                let setState = this.setState.bind(this);
                                let reader = new FileReader();
                                reader.onload = function (event) {
                                    setState({ ...this.state, profilePic: event.target.result, updatedProfilePic: true });
                                }
                                reader.readAsDataURL(e.target.files[0]);
                            }} />
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
                                    uploadProfilePicture(document.getElementById("changeProfilePictureUpload").files[0], this.props.userType) // Send image to the server
                                        .then((imageFile) => changeUserImage(imageFile));
                                }}>Save</Button>
                        </ThemeProvider>
                    </div>

                    <div className="imageUploadButtons">
                        <h6>Cover Picture</h6>
                        <input type="file" id="changeCoverPictureUpload" hidden accept="image/*"
                            onChange={e => {
                                let setState = this.setState.bind(this);
                                let reader = new FileReader();
                                reader.onload = function (event) {
                                    setState({ ...this.state, coverPic: event.target.result, updatedCoverPic: true });
                                }
                                reader.readAsDataURL(e.target.files[0]);
                            }} />
                        <label htmlFor="changeCoverPictureUpload">
                            <ThemeProvider theme={customTheme}>
                                <Button color="primary" aria-label="upload profile picture" component="span" variant="contained" startIcon={<PhotoCamera />}>
                                    Upload</Button>
                            </ThemeProvider>
                        </label>

                        <ThemeProvider theme={customTheme}>
                            <Button color="primary" variant="contained" startIcon={<SaveAltIcon />}
                                onClick={(e) => {
                                    e.preventDefault();
                                    uploadCoverPicture(document.getElementById("changeCoverPictureUpload").files[0], this.props.userType) // Send image to the server
                                        .then((imageFile) => changeUserCoverImage(imageFile));
                                }}>Save</Button>
                        </ThemeProvider>
                    </div>


                    <ProfileImageArea profilePic={this.state.profilePic} coverPic={this.state.coverPic}
                        updatedProfilePic={this.state.updatedProfilePic} updatedCoverPic={this.state.updatedCoverPic}
                        width={"summaryBigWidth"} height={"summaryBigHeight"} />
                </div>
            </div>
        );

    }

}