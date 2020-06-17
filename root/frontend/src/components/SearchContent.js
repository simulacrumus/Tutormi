import React from "react";
import TutorProfile from "./TutorProfile";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

const SearchContent = ({ tutors = [] }) => {
  let key = 10;
  return (
    <Grid container spacing={4}>
      {tutors.tutors.map((tutor) => (
        <Grid key={++key} item xs={12} md={4}>
          <TutorProfile
            key={tutor.name} //needs to be changed in the future, ideally tutor.id would be the key
            id={tutor.id}
            title={tutor.user.name}
            avatarSrc="https://fiverr-res.cloudinary.com/images/t_smartwm/t_main1,q_auto,f_auto,q_auto,f_auto/attachments/delivery/asset/204d4f52e94ea02c1231bcbac1fc3326-1589400376/sample/draw-headshot-avatar-at-promo-price.jpg" //{require(`../images/uploads/${tutor.profilePic}`)}
            imgSrc="https://fiverr-res.cloudinary.com/images/t_smartwm/t_main1,q_auto,f_auto,q_auto,f_auto/attachments/delivery/asset/204d4f52e94ea02c1231bcbac1fc3326-1589400376/sample/draw-headshot-avatar-at-promo-price.jpg" //{require(`../images/uploads/${tutor.coverPic}`)}
            description={tutor.bio}
            rating={tutor.rating}
            courses={tutor.courses}
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
