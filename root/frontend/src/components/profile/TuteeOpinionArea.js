import React, { Component } from "react";
import Rating from '@material-ui/lab/Rating';
import { ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import customTheme from "../../styles/materialUiTheme";
import FavoriteIcon from '@material-ui/icons/Favorite';
import { connect } from "react-redux";
import { addTutorToFavorites, removeTutorFromFavorites, addRatingToTutor } from "../../store/user/userActions";
import { updateTuteeFavorites, addRating } from "../../util/apiCallFunctions";

class TuteeOpinionArea extends Component {

    render() {
        return (
            <div className="personalRatingContainer summarySmallWidth">
                <div>
                    <label >Your Rating:</label>
                    <Rating value={this.getTuteeRating()} onChange={(event, newValue) => this.handleRate(newValue)} />
                </div>
                <ThemeProvider theme={customTheme}>
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
        addRating(this.props.viewedTutor._id, newValue)
            .then((response) => {
                addRatingToTutor({
                    tutee: { id: this.props.tutee._id, name: this.props.tutee.user.name },
                    tutor: { id: this.props.viewedTutor._id, name: this.props.viewedTutor.user.name },
                    rate: newValue,
                    date: new Date()
                });
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

