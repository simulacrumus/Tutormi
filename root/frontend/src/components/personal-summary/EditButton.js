import React, { Component } from 'react';
import './EditButton.css';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { connect } from "react-redux";
import { updateUser } from "../../store/user/userActions";
import ListUpdateArea from './ListUpdateArea';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import { ThemeProvider } from "@material-ui/core/styles";
import customTheme from "../../styles/materialUiTheme";
import EditSocialArea from "./EditSocialArea";
import ChangeProfilePictureArea from "./ChangeProfilePictureArea";
import { updateUserInformation } from "../../util/apiCallFunctions";
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';

class EditButton extends Component {

  constructor(props) {
    super(props);
    this.state = { showEditModal: false, user: this.props.user, tabValue: 0, isSaving: false, errors: "" }
    this.updateSocialAccount = this.updateSocialAccount.bind(this);
  }

  render() {
    return (
      <>
        <img className="editIcon" src={require("../../images/edit-icon.png")} onClick={() => this.handleShow()} ></img>
        <Modal show={this.state.showEditModal} onHide={() => this.setState({ ...this.state, showEditModal: false })} animation={false} centered dialogClassName="editProfileModal">
          <Modal.Header closeButton>
            <Modal.Title>Edit Information</Modal.Title>
          </Modal.Header>

          <div className="editProfileModal">
            <Modal.Body>
              <ThemeProvider theme={customTheme}>
                <AppBar position="static">
                  <Tabs onChange={this.changeTab} value={this.state.tabValue} variant="fullWidth">
                    <Tab label="Main Information" />
                    <Tab label="Secondary Information" />
                    <Tab label="Change Password" />
                  </Tabs>
                </AppBar>
              </ThemeProvider>
              <br />

              {this.state.tabValue === 0 &&
                <Form>
                  <ChangeProfilePictureArea profilePic={this.props.user.profilePic} />
                  <Form.Group>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" value={this.state.user.user.email}
                      onChange={(e) => this.setState({ ...this.state, user: { ...this.state.user, user: { ...this.state.user.user, email: e.target.value } } })} />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" value={this.state.user.user.name}
                      onChange={(e) => this.setState({ ...this.state, user: { ...this.state.user, user: { ...this.state.user.user, name: e.target.value } } })} />
                  </Form.Group>

                  <Form.Group >
                    <Form.Label>Bio</Form.Label>
                    <Form.Control as="textarea" rows="3" value={this.state.user.bio}
                      onChange={(e) => this.setState({ ...this.state, user: { ...this.state.user, bio: e.target.value } })} />
                  </Form.Group>

                  {this.props.user.user.type === "tutor" &&
                    <ListUpdateArea list={this.state.user.courses} label="Courses" type="course" setList={this.setCourses} />}
                </Form>
              }

              {this.state.tabValue === 1 &&
                <Form>
                  <ListUpdateArea list={this.state.user.languages} label="Languages" type="language" setList={this.setLanguages} />

                  <Form.Group>
                    <Form.Label>Location</Form.Label>
                    <Form.Control type="text" value={this.state.user.location}
                      onChange={(e) => this.setState({ ...this.state, user: { ...this.state.user, location: e.target.value } })} />
                  </Form.Group>

                  <EditSocialArea updateSocialAccount={this.updateSocialAccount} social={this.state.user.social} />
                </Form>}

              <br />
              <ThemeProvider theme={customTheme}>
                {this.state.isSaving && <LinearProgress />}
              </ThemeProvider >
              {this.state.errors !== "" && <h6 className="editFormErrorMessage">{this.state.errors}</h6>}
            </Modal.Body>
          </div>



          <Modal.Footer>
            <ThemeProvider theme={customTheme} >
              <Button color="primary" variant="contained" onClick={() => {
                this.setState({ ...this.state, isSaving: true })
                let editInformation = {
                  name: this.state.user.user.name,
                  bio: this.state.user.bio,
                  languages: this.state.user.languages,
                  location: this.state.user.location,
                  courses: this.state.user.courses,
                  social: this.state.user.social
                };
                updateUserInformation(editInformation, this.state.user.user.type)  // Update the server with the new user information
                  .then((updateResponse) => {
                    if (updateResponse.errors === undefined) { // No errors occurred when updating
                      updateUser(editInformation);
                      this.setState({ ...this.state, isSaving: false, showEditModal: false }); // Close the modal 
                    } else {
                      this.setState({ ...this.state, isSaving: false, showEditModal: true, errors: updateResponse.errors[0].msg }); // Notify users of errors 
                      setTimeout(() => this.setState({ ...this.state, isSaving: false, errors: null }), 2000); // Stop showing error after 2 seconds
                    }
                  });
              }}>Save Changes</Button>

            </ThemeProvider>

          </Modal.Footer>
        </Modal>
      </>
    );

  }

  handleShow = () => {
    this.setState({ showEditModal: true, user: this.props.user, tabValue: 0, errors: "" }); // The modal needs to always have the most up to date courses and languages on show
  };

  changeTab = (e, newTabValue) => {
    this.setState({ ...this.state, tabValue: newTabValue });
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

export default connect(mapStateToProps)(EditButton);