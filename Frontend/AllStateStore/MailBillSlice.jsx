import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import axios from "axios";
import toast from "react-hot-toast";
import deleteConfirm from "../components/General/DeleteConfirm";

const initialState = {
  bill: [],
  loading: false,
  error: null,
};

const billSlice = createSlice({
  name: "downloadBill",
  initialState,
  reducers: {
    request: (state) => {
      state.loading = true;
      state.error = null;
    },
    failure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create
    createBillSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
    },
  },
});

export const { request, failure, createBillSuccess } = billSlice.actions;

export default billSlice.reducer;

export const mailPersonalBillsToSelf = (id) => async (dispatch, getState) => {
  dispatch(request());
  Swal.fire({
    title: "Wait!!, Sending Bill to Your Mail...",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });
  try {
    const token =
      getState().authentication.token || localStorage.getItem("token");

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/admin/mail/personalBill/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      }
    );
    dispatch(createBillSuccess());

    toast.success("Bill Mailed successfully!, Check Your Mail");
    Swal.close();
    Swal.fire("Success!", "Bill mailed to your registered email.", "success");
  } catch (error) {
    Swal.close();
    dispatch(failure(error.response?.data?.message || error.message));
  }
};
export const mailPersonalBillsToOther =
  (id, email) => async (dispatch, getState) => {
    dispatch(request());
    Swal.fire({
      title: `Sending Bill To : ${email}`,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const token =
        getState().authentication.token || localStorage.getItem("token");

      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_API
        }/admin/mail/personalBill/other/${id}`,
        { email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch(createBillSuccess());
      Swal.close();
      Swal.fire("Success!", `Bill mailed to ${email}`, "success");
      toast.success(`Bill is Sent To: ${email}`);
    } catch (error) {
      Swal.close();
      dispatch(failure(error.response?.data?.message || error.message));
    }
  };

export const mailMainBillToSelf = (id) => async (dispatch, getState) => {
  dispatch(request());
  Swal.fire({
    title: "Wait!!, Sending Bill to Your Mail...",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });
  try {
    const token =
      getState().authentication.token || localStorage.getItem("token");

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/admin/mail/mainBill/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      }
    );
    dispatch(createBillSuccess());

    toast.success("Bill Mailed successfully!, Check Your Mail");
    Swal.close();
    Swal.fire("Success!", "Bill mailed to your registered email.", "success");
  } catch (error) {
    Swal.close();
    dispatch(failure(error.response?.data?.message || error.message));
  }
};
export const mailMainBillToOther =
  (id, email) => async (dispatch, getState) => {
    dispatch(request());
    Swal.fire({
      title: `Sending Bill To : ${email}`,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const token =
        getState().authentication.token || localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/admin/mail/mainBill/other/${id}`,
        { email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch(createBillSuccess());
      Swal.close();
      Swal.fire("Success!", `Bill mailed to ${email}`, "success");
      toast.success(`Bill is Sent To: ${email}`);
    } catch (error) {
      Swal.close();
      dispatch(failure(error.response?.data?.message || error.message));
    }
  };