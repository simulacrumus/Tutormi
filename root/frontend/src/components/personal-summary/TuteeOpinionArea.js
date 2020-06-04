import React, { Component } from "react";
import Rating from '@material-ui/lab/Rating';
import { ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import customTheme from "../../styles/materialUiTheme";
import FavoriteIcon from '@material-ui/icons/Favorite';
import { connect } from "react-redux";
import { addTutorToFavorites, removeTutorFromFavorites } from "../../store/user/userActions";

class TuteeOpinionArea extends Component {

    render() {
        return (
            <div className="personalRatingContainer">
                <div>
                    <label >Your Rating:</label>
                    <Rating value={this.props.viewedTutor.rating} onChange={(event, newValue) => {
                        // Add code when route is done
                    }} />
                </div>
                <ThemeProvider theme={customTheme}>
                    <Button color="primary" variant="contained" startIcon={<FavoriteIcon />}
                        onClick={() => {
                            if (this.props.tutee.following.some((tutor) => tutor.user._id === this.props.viewedTutor.user._id)) {
                                removeTutorFromFavorites(this.props.viewedTutor.user._id);
                            } else {
                                addTutorToFavorites(this.props.viewedTutor);
                            }
                        }}>
                        {!this.props.tutee.following.some((tutor) => tutor.user._id === this.props.viewedTutor.user._id)
                            ? "Add to favorites" : "Remove from favorites"}
                    </Button>
                </ThemeProvider>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        tutee: state.user.user,
        viewedTutor: state.viewedTutor.viewedTutor
    };
}

export default connect(mapStateToProps)(TuteeOpinionArea);
