import React, { Component } from "react";
import "./PersonalSummary.css";
import { SocialIcon } from "react-social-icons";
import EditButton from "./EditButton.js";
import Rating from '@material-ui/lab/Rating';
import TuteeOpinionArea from "./TuteeOpinionArea";

export default class PersonalSummary extends Component {

  render() {
    return (
      <div className="summarySection">
        <img className="profileImg" src={require(`../../images/uploads/${this.props.person.profilePic}`)} />
        <div className="textContainer">
          <dv className="nameContainer">
            <h3>{this.props.person.user.name}</h3>
            {!this.props.isUser && <Rating value={this.props.person.rating} readOnly />}
          </dv>
          <h6>{this.props.person.user.email}</h6>
          <p>{this.props.person.bio}</p>
          <p>
            {this.props.person.courses !== undefined // Change condition later
              ? "Course(s): " +
              this.props.person.courses.map((course) => ` ${course} `)
              : null}
            <br />
            Language(s):
            {typeof this.props.person.languages !== "undefined"
              ? this.props.person.languages.map((language) => ` ${language} `)
              : null}
            <br />
            Location: {this.props.person.location}
          </p>
        </div>
        <div className="socialArea">{this.createSocialArea()}</div>

        {this.props.isUser && <div className="editContainer">
          <EditButton className="editIcon" />
        </div>}

        {!this.props.isUser && <TuteeOpinionArea />}
      </div>
    );
  }

  createSocialArea() {
    if (this.props.person.social === null)
      return;
    let socialAccounts = Object.values(this.props.person.social); // Change color later
    // Had to add 'https://' to the start of the links given in the backend examples. Will probably remove later
    return socialAccounts.map((socialAccount) => (
      <SocialIcon
        bgColor="#a385e0"
        url={`https://${socialAccount}`}
        target="_blank"
      />
    ));
  }
}
