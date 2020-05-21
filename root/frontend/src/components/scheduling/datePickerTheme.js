import { createMuiTheme } from "@material-ui/core";
import purple from "@material-ui/core/colors/purple";

const datePickerTheme = createMuiTheme({
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: "#a385e0",
      },
    },
    MuiPickersCalendarHeader: {
      switchHeader: {
        backgroundColor: "#a385e0",
        color: "white",
      },
    },
    MuiPickersDay: {
    //   day: {
    //     color: purple.A700,
    //   },
      daySelected: {
        backgroundColor: purple["400"],
      },
    //   dayDisabled: {
    //     color: purple["100"],
    //   },
      current: {
        color: purple["900"],
      },
    },
    MuiPickersModal: {
      dialogAction: {
        color: purple["400"],
      },
    },
  },
});

export default datePickerTheme;