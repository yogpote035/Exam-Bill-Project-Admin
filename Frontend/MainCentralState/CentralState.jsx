import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "../AllStateStore/AuthenticationSlice";
import billReducer from "../AllStateStore/BillSlice";
import downloadReducer from "../AllStateStore/DownloadBillSlice";
import mailReducer from "../AllStateStore/MailBillSlice";
import teacherReducer from "../AllStateStore/TeacherSlice";
import profileReducer from "../AllStateStore/ProfileSlice";

const CentralStore = configureStore({
  reducer: {
    authentication: authenticationReducer,
    bill: billReducer,
    download: downloadReducer,
    mail: mailReducer,
    teacher: teacherReducer,
    profile: profileReducer,
  },
});

export default CentralStore;
