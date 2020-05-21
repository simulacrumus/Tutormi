import React, { Component, useState } from 'react';
import './PersonalSummary.css';
import { SocialIcon } from 'react-social-icons';
import EditButton from './EditButton.jsx';

export default class PersonalSummary extends Component {

    render() {
        return (
            <div className='summarySection'>
                <img className="profileImg" src={this.props.person.imgPath} />
                <div className="textContainer">
                    <h3>{this.props.person.user.name}</h3>
                    <h6>{this.props.person.user.email}</h6>
                    <p>{this.props.person.bio}</p>
                    <p>{typeof this.props.person.courses !== "undefined" ? "Course(s): " + this.props.person.courses.map((course) => ` ${course} `) : ""}<br />
                        Language(s):{typeof this.props.person.languages !== "undefined" ? this.props.person.languages.map((language) => ` ${language} `) : ""}
                        <br />Location: {this.props.person.location}
                    </p>
                </div>
                <div className="socialArea">
                    {this.createSocialArea()}
                </div>
                <div className="editContainer">
                    {this.props.isUser ? <EditButton className="editIcon" /> : ""}
                </div>

            </div>
        );
    }

    createSocialArea() {
        let socialAccounts = Object.values(this.props.person.social); // Change color later
        // Had to add 'https://' to the start of the links given in the backend examples. Will probably remove later
        return socialAccounts.map((socialAccount) => <SocialIcon bgColor="#a385e0" url={`https://${socialAccount}`} target="_blank" />);
    }

}

