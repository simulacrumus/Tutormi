import React, { Component, useState } from 'react';
import '../styles/PersonalSummary.css';
import { SocialIcon } from 'react-social-icons';
import EditButton from './EditButton.jsx';

export default class PersonalSummary extends Component {

    render() {
        return (
            <div className='summarySection'>
                <img className="profileImg" src={this.props.person.imgPath} />
                <div className="textContainer">
                    <h3>{this.props.person.firstName + " " + this.props.person.lastName}</h3>
                    <p>{this.props.person.about}</p>
                    <p>{typeof this.props.person.courses !== "undefined" ? "Course(s): " + this.props.person.courses.map((course) => ` ${course} `) : ""}<br />
                        Language(s):{typeof this.props.person.languages !== "undefined" ? this.props.person.languages.map((language) => " " + language) : ""}
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
        return socialAccounts.map((socialAccount) => <SocialIcon bgColor="#a385e0" url={socialAccount} target="_blank" />);
    }

}

