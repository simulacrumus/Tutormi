import React, { Component } from "react";
import "./ProfileImagesArea.css";

export default class ProfileImagesArea extends Component {

    render() {
        return (
            <div className={`profileAndCoverPicContainer ${this.props.width} ${this.props.height}`}>
                <img className={`profileImg`}
                    src={this.props.updatedProfilePic ? this.props.profilePic : require(`../../images/uploads/${this.props.profilePic}`)} />

                <img className={`coverImg`}
                    src={this.props.updatedCoverPic ? this.props.coverPic : require(`../../images/uploads/${this.props.coverPic}`)} />
            </div>
        );
    }

}
