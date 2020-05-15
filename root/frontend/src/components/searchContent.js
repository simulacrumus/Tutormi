import React from "react";
import TutorProfile from "./tutorProfile";
import { Grid } from "@material-ui/core";

const SearchContent = () => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <TutorProfile
          title="Jason Mitchell"
          subTitle="$15.00"
          avatarSrc="https://fiverr-res.cloudinary.com/images/t_smartwm/t_main1,q_auto,f_auto,q_auto,f_auto/attachments/delivery/asset/204d4f52e94ea02c1231bcbac1fc3326-1589400376/sample/draw-headshot-avatar-at-promo-price.jpg"
          imgSrc="https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/105295613/original/6d0adc56aa1cb5b422149e81c5b6a5d035cbfde4/code-in-javascript-ajax-xml-and-json-for-your-website.jpg"
          description="Hi, Thanks for having a look into my service.

          My name is Samar Hassan. I am an experienced web developer and I have done web projects for dozens of customers from around the globe.
          
          I will do anything related to JavaScript and jquery and help you in solving different problems as you want."
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TutorProfile
          title="Mark Steinberg"
          subTitle="$30.91"
          avatarSrc="https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/130159783/original/edc9e71f866ec8d9809011d427f88c4cd8f20a64/draw-headshot-avatar-at-promo-price.jpg"
          imgSrc="https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/126986444/original/09edbe3edbd630ebdc065286843c261e6bd303bb/help-you-in-javascript-reactjs-redux-graphql-gatsby-nodejs-and-express.jpg"
          description="I will create an interactive web site/mobile app for your business. This could range from a traditional-style web site with animated text to a web app/mobile app for your online business.
          I am an experienced React developer with  3+ years of modern JS framework development!"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TutorProfile
          title="Sophie Anne"
          subTitle="$49.99"
          avatarSrc="https://fiverr-res.cloudinary.com/images/t_smartwm/t_main1,q_auto,f_auto,q_auto,f_auto/attachments/delivery/asset/cffc3241595301d90281f131cb1cb153-1589314455/sample/draw-headshot-avatar-at-promo-price.jpg"
          imgSrc="https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/119089171/original/9234145c14660bcea0da5c9d74ce489d6a4cccae/do-statistical-data-analysis-in-r-and-excel.png"
          description="I am here to help you out with you Statistical data analysis, machine learning & data science projects, problems and other real-life issues that you face.
          I am expert in Python ,R and MS Excel for data science.
          Skills:
          Statistical data analysis
          Data cleaning and pre-processing"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TutorProfile
          title="Call Me Einstein(Genius)"
          subTitle="$73.87"
          avatarSrc="https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs3/130159783/original/c918d4ad0e47d13b484d01b488aeecd56c826c0b/draw-headshot-avatar-at-promo-price.jpg"
          imgSrc="https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/132148738/original/cf66017c74355369b764108f0139a6c0cc53961d/do-c-cpp-java-python-assignments-and-projects.jpg"
          description="I am a programmer with more than 2 years of experience with languages C/C++, Python, Java, ASM x86 and bash scripting. I've had a successful career in Competitive Programming and have been a straight-A student in programming courses so you can rely on me!!!! 
"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TutorProfile
          title="Elon Musk"
          subTitle="$16.10"
          avatarSrc="https://fiverr-res.cloudinary.com/images/t_smartwm/t_main1,q_auto,f_auto,q_auto,f_auto/attachments/delivery/asset/491abec67d22434aa02ae4c8cbbecc6e-1588935481/avatar52176_sample/draw-headshot-avatar-at-promo-price.jpg"
          imgSrc="https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/148237724/original/5da8a6b8d2bcd446116fb3d1fe58c1692b5f27b9/assist-in-maths-calculus-probability-and-stats-tasks.png"
          description="I am a Civil Engineer and have 4 years of experience in tutoring and assisting in maths. 
          I am good at handling:
          
          - Probability
          - Mathemetics
          - Integration
          - Statistics
          - Geometry/Trigonometry
          - Linear Algebra
          - Calculus 1, 2 & 3
          - Statistics 1, 2
          - Discrete mathematics"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TutorProfile
          title="Tina SomeName"
          subTitle="$18.50"
          avatarSrc="https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs2/130159783/original/c14010aaaad4989b24fd3034ab7de1d64e8ec303/draw-headshot-avatar-at-promo-price.jpg"
          imgSrc="https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/145482708/original/7091fee16be7c52664470cf2254527ae524dbff1/do-website-designing-and-development-in-react-js-and-vue-js.png"
          description="I'll build React applications by creating reusable components by writing a clean and optimized code using best practices that will load faster and increase performance with full responsiveness on all devices.
          Feel free to ask me anything. I've 1+ years of experience in web development!"
        />
      </Grid>
    </Grid>
  );
};

export default SearchContent;
