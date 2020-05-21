import React from "react";
import TutorProfile from "./TutorProfile";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

const SearchContent = ({ tutors = [] }) => {
  return (
    <Grid container spacing={4}>
      {tutors.map((tutor) => (
        <Grid key={tutor.id} item xs={12} md={4}>
          <TutorProfile
            key={tutor.name} //needs to be changed in the future, ideally tutor.id would be the key
            id={tutor.id}
            title={tutor.name}
            avatarSrc="https://fiverr-res.cloudinary.com/images/t_smartwm/t_main1,q_auto,f_auto,q_auto,f_auto/attachments/delivery/asset/204d4f52e94ea02c1231bcbac1fc3326-1589400376/sample/draw-headshot-avatar-at-promo-price.jpg"
            imgSrc="https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/105295613/original/6d0adc56aa1cb5b422149e81c5b6a5d035cbfde4/code-in-javascript-ajax-xml-and-json-for-your-website.jpg"
            description={tutor.bio}
            rating={tutor.rating}
          />
        </Grid>
      ))}
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  tutors: state.tutorSearchList,
});
export default connect(mapStateToProps, null)(SearchContent);
