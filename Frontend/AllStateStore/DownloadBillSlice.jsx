import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import axios from "axios";
import toast from "react-hot-toast";
import deleteConfirm from "../../Components/General/DeleteConfirm";

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

export const downloadBill = (id) => async (dispatch, getState) => {
  dispatch(request());
  Swal.fire({
    title: "Preparing your Bill...",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

  try {
    const token =
      getState().authentication.token || localStorage.getItem("token");

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/bill/download/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      }
    );

    Swal.close();

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Bill-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    dispatch(createBillSuccess());
    toast.success("Bill downloaded successfully!");
  } catch (error) {
    Swal.close();
    dispatch(failure(error.response?.data?.message || error.message));
  }
};
export const downloadBankDetailForm = () => async (dispatch, getState) => {
  dispatch(request());
  Swal.fire({
    title: "Preparing your Bank Detail Form...",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

  try {
    const token =
      getState().authentication.token || localStorage.getItem("token");

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/bill/download/bank-detail-form`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      }
    );

    Swal.close();

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Bank-Detail-Form.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    dispatch(createBillSuccess());
    toast.success("Bill downloaded successfully!");
  } catch (error) {
    Swal.close();
    dispatch(failure(error.response?.data?.message || error.message));
  }
};
export const downloadPersonBill = (id) => async (dispatch, getState) => {
  Swal.fire({
    title: "Are you sure?",
    text: "Download Person Bill for Each Person You Get Separate Bill!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Proceed!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      dispatch(request());
      Swal.fire({
        title: "Preparing Bills for individual...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        const token =
          getState().authentication.token || localStorage.getItem("token");

        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_API
          }/bill/download/personalBill/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
          }
        );

        Swal.close();

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Bill-individual-Person-${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        dispatch(createBillSuccess());
        toast.success("Bill downloaded successfully!");
      } catch (error) {
        Swal.close();
        dispatch(failure(error.response?.data?.message || error.message));
      }
    }
  });
};
