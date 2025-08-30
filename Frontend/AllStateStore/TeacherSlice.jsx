import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import axios from "axios";
import toast from "react-hot-toast";
import deleteConfirm from "../../Components/General/DeleteConfirm";

const initialState = {
  teachers: [],
  singleTeacher: [],
  loading: false,
  error: null,
};

const billSlice = createSlice({
  name: "bill",
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

    // Fetch
    fetchAllTeachersSuccess: (state, action) => {
      state.loading = false;
      state.teachers = action.payload;
      state.error = null;
    },
    // Fetch
    fetchSingleTeacherSuccess: (state, action) => {
      state.loading = false;
      state.singleTeacher = action.payload;
      state.error = null;
    },
  },
});

export const {
  request,
  failure,
  createBillSuccess,
  fetchAllTeachersSuccess,
  fetchSingleTeacherSuccess,
} = billSlice.actions;

export default billSlice.reducer;
//  Get token
const getAuthHeader = (getState) => {
  const token =
    getState().authentication?.token || localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};
export const fetchBills = () => async (dispatch, getState) => {
  dispatch(request());
  Swal.fire({ title: "Fetching Bills...", didOpen: () => Swal.showLoading() });

  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/bill`,
      getAuthHeader(getState)
    );

    Swal.close();
    dispatch(fetchAllBillsSuccess(data?.data));
  } catch (err) {
    Swal.close();
    dispatch(failure(err.response?.data?.message || "Fetch failed"));
    toast.error(err.response?.data?.message || "Fetch failed");
  }
};
export const fetchBillById = (id) => async (dispatch, getState) => {
  dispatch(request());
  Swal.fire({ title: "Fetching Bills...", didOpen: () => Swal.showLoading() });

  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/bill/${id}`,
      getAuthHeader(getState)
    );

    Swal.close();
    dispatch(fetchSingleBillsSuccess(data?.data));
  } catch (err) {
    Swal.close();
    dispatch(failure(err.response?.data?.message || "Fetch failed"));
    toast.error(err.response?.data?.message || "Fetch failed");
  }
};
