import React, { Component } from "react";
import Rating from '@material-ui/lab/Rating';
import { ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import customTheme from "../../styles/materialUiTheme";
import FavoriteIcon from '@material-ui/icons/Favorite';
import { connect } from "react-redux";
import { addTutorToFavorites, removeTutorFromFavorites, addRatingToTutor } from "../../store/user/userActions";
import { updateTutorRating } from "../../store/viewed-tutor/viewedTutorActions";
import { updateTuteeFavorites, addRating } from "../../util/apiCallFunctions";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';

class TuteeOpinionArea extends Component {

    render() {
        return (
            <div className="personalRatingContainer summarySmallWidth">
                <ThemeProvider theme={customTheme}>
                    <div className="ratingContainer">
                        <label >Your Rating:</label>
                        <Rating value={this.getTuteeRating().rate} onChange={(event, newValue) => this.handleRate(newValue)} />
                        <IconButton aria-label="delete" color="primary">
                            <HighlightOffIcon />
                        </IconButton>
                    </div>
                    <Button color="primary" variant="contained" startIcon={<FavoriteIcon />}
                        onClick={() => {
                            if (this.props.tutee.favorites.some((tutor) => tutor._id === this.props.viewedTutor._id)) {
                                updateTuteeFavorites(this.props.viewedTutor._id, false);
                                removeTutorFromFavorites(this.props.viewedTutor._id);
                            } else {
                                updateTuteeFavorites(this.props.viewedTutor._id, true);
                                addTutorToFavorites(this.props.viewedTutor);
                            }
                        }}>
                        {!this.props.tutee.favorites.some((tutor) => tutor._id === this.props.viewedTutor._id)
                            ? "Add to favorites" : "Remove from favorites"}
                    </Button>
                </ThemeProvider>
            </div>
        );
    }

    getTuteeRating = () => {
        // let givenRating = this.props.tutee.ratings.filter((rating) => this.props.viewedTutor._id === rating.tutor.id);
        // return givenRating === undefined ? 0 : givenRating;
        return 0;
    }

    handleRate = (newValue) => {
        addRating(this.props.viewedTutor._id, newValue, this.getTuteeRating().id)
            .then((response) => {
                addRatingToTutor(response.rating);
                updateTutorRating(response.average);
            });
    }

}

function mapStateToProps(state) {
    return {
        tutee: state.user.user,
        viewedTutor: state.viewedTutor.viewedTutor
    };
}

export default connect(mapStateToProps)(TuteeOpinionArea);

