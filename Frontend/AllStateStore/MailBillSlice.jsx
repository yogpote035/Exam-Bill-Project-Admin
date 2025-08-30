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
      `${import.meta.env.VITE_BACKEND_API}/bill/mail/personalBill/${id}`,
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
        }/bill/mail/personalBill/other/${id}`,
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
      `${import.meta.env.VITE_BACKEND_API}/bill/mail/mainBill/${id}`,
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
        `${import.meta.env.VITE_BACKEND_API}/bill/mail/mainBill/other/${id}`,
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