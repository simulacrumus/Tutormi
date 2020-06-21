import React, { Component } from 'react';
import './CreateProfilePage.css';
import Form from 'react-bootstrap/Form';
import { connect } from "react-redux";
import { logIn } from "../../util/apiCallFunctions";
import ListUpdateArea from '../../components/profile/edit-profile/ListUpdateArea';
import { ThemeProvider } from "@material-ui/core/styles";
import customTheme from "../../styles/materialUiTheme";
import EditSocialArea from "../../components/profile/edit-profile/EditSocialArea";
import ChangeUserImagesArea from "../../components/profile/edit-profile/ChangeUserImagesArea";
import { updateUserInformation, uploadProfilePicture, uploadCoverPicture } from "../../util/apiCallFunctions";
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { userWithProfileLoggedIn } from "../../store/user/userActions";
import PhotoCamera from '@material-ui/icons/PhotoCamera';

class CreateProfilePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            profilePic: "default-profile-pic.png",
            coverPic: "default-cover-pic.png",
            profilePicFile: null,
            coverPicFile: null,
            updatedProfilePic: false,
            updatedCoverPic: false,
            bio: "",
            courses: [],
            languages: [],
            location: null,
            social: {
                linkedin: null,
                twitter: null,
                facebook: null,
                instagram: null,
                youtube: null
            },
            isSaving: false,
            errors: null,
            activeStep: 1
        }
        this.updateSocialAccount = this.updateSocialAccount.bind(this);
        this.setProfilePic = this.setProfilePic.bind(this);
        this.setCoverPic = this.setCoverPic.bind(this);
    }

    render() {
        console.log(this.state.updatedProfilePic, this.state.updatedProfilePic)
        return (
            <>
                <div className="pageContainer">
                    <div className="createProfileContainer">
                        <ThemeProvider theme={customTheme}>
                            <Stepper activeStep={this.state.activeStep}>
                                <Step key={0} >
                                    <StepLabel >Set up basic account</StepLabel>
                                </Step>
                                <Step key={1} >
                                    <StepLabel >Main information</StepLabel>
                                </Step>
                                <Step key={3} >
                                    <StepLabel >Extra information</StepLabel>
                                </Step>
                            </Stepper>
                            <div className="stepperButtons">
                                <div>
                                    <Button disabled={this.state.activeStep === 1} color="primary" variant="contained" onClick={() => this.stepBack()}>
                                        Back</Button>
                                    <Button disabled={this.state.activeStep === 2} color="primary" variant="contained" onClick={() => this.stepForward()}>
                                        Next</Button>
                                </div>
                                <Button disabled={this.state.activeStep !== 2} color="primary" variant="contained" onClick={(e) => this.createProfile(e)}>
                                    Create Profile</Button>
                            </div>
                        </ThemeProvider>

                        <Form>
                            <Form.Text >
                                Fields marked with a star <b>*</b> are mandatory
                            </Form.Text>
                            <ThemeProvider theme={customTheme}>
                                {this.state.isSaving && <LinearProgress />}
                            </ThemeProvider >
                            {this.state.errors !== "" && <h6 className="editFormErrorMessage">{this.state.errors}</h6>}

                            {this.state.activeStep === 1 &&
                                <>
                                    <ChangeUserImagesArea profilePic={this.state.profilePic} coverPic={this.state.coverPic}
                                        userType={this.props.type} setProfilePic={this.setProfilePic} setCoverPic={this.setCoverPic}
                                        updatedProfilePic={this.state.updatedProfilePic} updatedCoverPic={this.state.updatedCoverPic} />



                                    <Form.Group >
                                        <Form.Label>Bio</Form.Label>
                                        <Form.Control as="textarea" rows="3" value={this.state.bio} placeholder="Give a brief description about yourself"
                                            onChange={(e) => this.setState({ ...this.state, bio: e.target.value })} />
                                    </Form.Group>

                                    {this.props.type === "tutor" &&
                                        <ListUpdateArea list={this.state.courses} label="Courses*" type="course" setList={this.setCourses} />}

                                    <ListUpdateArea list={this.state.languages} label="Languages*" type="language" setList={this.setLanguages} />
                                </>
                            }

                            {this.state.activeStep === 2 &&
                                <>
                                    <Form.Group>
                                        <Form.Label>Location</Form.Label>
                                        <Form.Control type="text" value={this.state.location} placeholder="Where you live"
                                            onChange={(e) => this.setState({ ...this.state, location: e.target.value })} />
                                    </Form.Group>

                                    <EditSocialArea updateSocialAccount={this.updateSocialAccount} social={this.state.social} />
                                </>
                            }

                        </Form>
                    </div>
                </div >
            </>
        );
    }

    setProfilePic(pic, file) {
        this.setState({ ...this.state, profilePic: pic, updatedProfilePic: true, profilePicFile: file });
    }

    setCoverPic(pic, file) {
        this.setState({ ...this.state, coverPic: pic, updatedCoverPic: true, coverPicFile: file });
    }

    async createProfile(e) {
        e.preventDefault();
        this.setState({ ...this.state, isSaving: true })
        let editInformation = {
            bio: this.state.bio,
            languages: this.state.languages,
            location: this.state.location,
            courses: this.state.courses,
            social: this.state.social
        };
        let updateResponse = await updateUserInformation(editInformation, this.props.type);  // Update the server with the new user information
        if (updateResponse.errors === undefined) { // No errors occurred when updating
            await uploadProfilePicture(this.state.profilePicFile, this.props.type); // Send image to the server
            await uploadCoverPicture(this.state.coverPicFile, this.props.type);

            const user = await logIn(this.props.token, this.props.type);


            userWithProfileLoggedIn(user); // Update global state
            // window.location.href = "/profile";

        } else {
            this.setState({ ...this.state, isSaving: false, errors: updateResponse.errors[0].msg }); // Notify users of errors 
            setTimeout(() => this.setState({ ...this.state, isSaving: false, errors: null }), 2000); // Stop showing error after 2 seconds
        }
    }

    stepForward = () => {
        this.setState({ ...this.state, activeStep: (this.state.activeStep + 1) })
    }

    stepBack = () => {
        this.setState({ ...this.state, activeStep: (this.state.activeStep - 1) })
    }

    setCourses = (courses) => {
        this.setState({ ...this.state, courses: courses });
    }

    setLanguages = (languages) => {
        this.setState({ ...this.state, languages: languages });
    }

    updateSocialAccount(event, socialType) {
        this.setState({
            ...this.state,
            social: { ...this.state.social, [socialType]: event.target.value }
        }
        );
    }

}

function mapStateToProps(state) {
    return {
        type: state.user.user.user.type,
        token: state.user.token
    };
}

export default connect(mapStateToProps)(CreateProfilePage);