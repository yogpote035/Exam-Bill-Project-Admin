import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, verifyOtpAndReset } from "../../AllStateStore/ProfileSlice";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error: message } = useSelector((state) => state.profile);

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSendOtp = () => {
    dispatch(sendOtp(email)).then((result) => {
      if (result === true) {
        setStep(2);
      }
      // If false, stay on current step (don't reset form)
    });
  };

  const handleResetPassword = () => {
    dispatch(verifyOtpAndReset(email, otp.trim(), newPassword, navigate)).then(
      (result) => {
        if (result === false) {
          // setOtp("");
          // setNewPassword("");
        }
        // If true, the navigation will happen
      }
    );
  };

  // Add a function to go back to step 1 if needed
  const handleBackToEmail = () => {
    setStep(1);
    // Keep the email field filled for convenience
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      {step === 1 && (
        <>
          <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded"
          />
          <button
            onClick={handleSendOtp}
            disabled={loading || !email}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-2xl font-bold mb-4">
            Verify OTP & Reset Password
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            OTP sent to: {email}
            <button
              onClick={handleBackToEmail}
              className="ml-2 text-blue-600 hover:text-blue-800 text-xs"
            >
              Change email
            </button>
          </p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded"
          />
          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded"
          />
          <button
            onClick={handleResetPassword}
            disabled={loading || !otp || !newPassword}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {loading ? "Verifying..." : "Reset Password"}
          </button>
        </>
      )}
      {message && <p className="text-rose-600 mt-4">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
