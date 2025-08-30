import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import axios from "axios";
import toast from "react-hot-toast";
import deleteConfirm from "../components/General/DeleteConfirm";

const initialState = {
  teachers: [],
  singleTeacher: [],
  loading: false,
  error: null,
};

const teacherSlice = createSlice({
  name: "teacher",
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
} = teacherSlice.actions;

export default teacherSlice.reducer;
//  Get token
const getAuthHeader = (getState) => {
  const token =
    getState().authentication?.token || localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};
export const GetAllTeacher = () => async (dispatch, getState) => {
  dispatch(request());
  Swal.fire({
    title: "Fetching Teachers...",
    didOpen: () => Swal.showLoading(),
  });

  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/admin/teacher/teachers`,
      getAuthHeader(getState)
    );

    Swal.close();
    dispatch(fetchAllTeachersSuccess(data?.data));
  } catch (err) {
    Swal.close();
    dispatch(failure(err.response?.data?.message || "Fetch failed"));
    toast.error(err.response?.data?.message || "Fetch failed");
  }
};

export const GetTeacher = (id) => async (dispatch, getState) => {
  dispatch(request());
  Swal.fire({
    title: "Fetching Teacher Info...",
    didOpen: () => Swal.showLoading(),
  });

  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/admin/bill/${id}`,
      getAuthHeader(getState)
    );

    Swal.close();
    dispatch(fetchSingleTeacherSuccess(data?.data));
  } catch (err) {
    Swal.close();
    dispatch(failure(err.response?.data?.message || "Fetch failed"));
    toast.error(err.response?.data?.message || "Fetch failed");
  }
};

export const GetBillsByTeacher = (id) => async (dispatch, getState) => {
  dispatch(request());
  Swal.fire({
    title: "Fetching Teacher Bills...",
    didOpen: () => Swal.showLoading(),
  });

  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/admin/teacher/teacher/bills/${id}`,
      getAuthHeader(getState)
    );

    Swal.close();
    dispatch(fetchSingleTeacherSuccess(data?.data));
  } catch (err) {
    Swal.close();
    dispatch(failure(err.response?.data?.message || "Fetch failed"));
    toast.error(err.response?.data?.message || "Fetch failed");
  }
};
