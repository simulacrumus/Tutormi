import React, { Component } from 'react';
import './CreateProfilePage.css';
import Form from 'react-bootstrap/Form';
import { connect } from "react-redux";
import { updateUser } from "../store/user/userActions";
import ListUpdateArea from '../components/personal-summary/ListUpdateArea';
import { ThemeProvider } from "@material-ui/core/styles";
import customTheme from "../styles/materialUiTheme";
import EditSocialArea from "../components/personal-summary/EditSocialArea";
import ChangeProfilePictureArea from "../components/personal-summary/ChangeProfilePictureArea";
import { updateUserInformation } from "../util/apiCallFunctions";
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';

class CreateProfilePage extends Component {

    constructor(props) {
        super(props);
        this.state = { user: this.props.user, isSaving: false, errors: "" }
        this.updateSocialAccount = this.updateSocialAccount.bind(this);
    }

    render() {
        return (
            <div className="pageContainer">
                <div className="createProfileContainer">
                    <Form>
                        <Form.Text >
                            Fields marked with a star <b>*</b> are mandatory
                        </Form.Text>
                        <ChangeProfilePictureArea profilePic={this.props.user.profilePic} />

                        <Form.Group >
                            <Form.Label>Bio</Form.Label>
                            <Form.Control as="textarea" rows="3" value={this.state.user.bio} placeholder="Give a brief description about yourself"
                                onChange={(e) => this.setState({ ...this.state, user: { ...this.state.user, bio: e.target.value } })} />
                        </Form.Group>

                        {this.props.user.user.type === "tutor" &&
                            <ListUpdateArea list={this.state.user.courses} label="Courses*" type="course" setList={this.setCourses} />}

                        <ListUpdateArea list={this.state.user.languages} label="Languages*" type="language" setList={this.setLanguages} />

                        <Form.Group>
                            <Form.Label>Location</Form.Label>
                            <Form.Control type="text" value={this.state.user.location}
                                onChange={(e) => this.setState({ ...this.state, user: { ...this.state.user, location: e.target.value } })} />
                        </Form.Group>

                        <EditSocialArea updateSocialAccount={this.updateSocialAccount} social={this.state.user.social} />


                        <br />
                        <ThemeProvider theme={customTheme}>
                            {this.state.isSaving && <LinearProgress />}
                        </ThemeProvider >
                        {this.state.errors !== "" && <h6 className="editFormErrorMessage">{this.state.errors}</h6>}

                        <ThemeProvider theme={customTheme} >
                            <Button color="primary" variant="contained" onClick={() => {
                                this.setState({ ...this.state, isSaving: true })
                                let editInformation = {
                                    email: this.state.user.user.email,
                                    name: this.state.user.user.name,
                                    bio: this.state.user.bio,
                                    languages: this.state.user.languages,
                                    location: this.state.user.location,
                                    courses: this.state.user.courses,
                                    social: this.state.user.social
                                };
                                updateUserInformation(editInformation)  // Update the server with the new user information
                                    .then((updateResponse) => {
                                        if (updateResponse.errors === undefined) { // No errors occurred when updating
                                            updateUser(editInformation);
                                            this.setState({ ...this.state, isSaving: false, showEditModal: false }); // Close the modal 
                                        } else {
                                            this.setState({ ...this.state, isSaving: false, showEditModal: true, errors: updateResponse.errors[0].msg }); // Notify users of errors 
                                        }
                                    });
                            }}>Save Changes</Button>
                        </ThemeProvider>
                    </Form>
                </div>
            </div>
        );

    }

    setCourses = (courses) => {
        this.setState({ ...this.state, user: { ...this.state.user, courses: courses } });
    }

    setLanguages = (languages) => {
        this.setState({ ...this.state, user: { ...this.state.user, languages: languages } });
    }

    updateSocialAccount(event, socialType) {
        this.setState({
            ...this.state,
            user: {
                ...this.state.user,
                social: { ...this.state.user.social, [socialType]: event.target.value }
            }
        });
    }

}

function mapStateToProps(state) {
    return {
        user: state.user.user,
        token: state.user.token
    };
}

export default connect(mapStateToProps)(CreateProfilePage);