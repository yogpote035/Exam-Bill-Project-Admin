import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import TeachersList from "../components/Authentication/TeacherList";
import AllBills from "../components/Bill/AllBill";
import UpdateBill from "../components/Bill/updateBill";
import ViewBill from "../components/Bill/ViewBill";
import ForgotPassword from "../components/General/ForgotPassword";
import Navbar from "../components/General/Navbar";
import ProtectedRoutes from "../components/General/ProtectedRoutes";
import EditProfile from "../components/Profile/EditProfile";
import ViewProfile from "../components/Profile/ViewProfile";
import "./App.css";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <Navbar />
      <div className="mt-18"></div>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <AllBills />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/bills"
          element={
            <ProtectedRoutes>
              <AllBills />
            </ProtectedRoutes>
          }
        />{" "}
        <Route
          path="/teachers"
          element={
            <ProtectedRoutes>
              <TeachersList />
            </ProtectedRoutes>
          }
        />{" "}
        <Route
          path="/teacher/:id"
          element={
            <ProtectedRoutes>
              <AllBills />
            </ProtectedRoutes>
          }
        />{" "}
        <Route
          path="/view-bill/:id"
          element={
            <ProtectedRoutes>
              <ViewBill />
            </ProtectedRoutes>
          }
        />{" "}
        <Route
          path="/edit-bill/:id"
          element={
            <ProtectedRoutes>
              <UpdateBill />
            </ProtectedRoutes>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoutes>
              <ViewProfile />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoutes>
              <EditProfile />
            </ProtectedRoutes>
          }
        />
        <Route path="/change-password" element={<ForgotPassword />} />
      </Routes>
    </>
  );
}

export default App;
