import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../http";

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState("Verifying...");
  const { token } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const verifyEmailToken = async () => {
      try {
        const response = await axios.post("api/users/verify-email", { token });

        if (response.data.success) {
          setVerificationStatus("Email verified successfully!");
          navigate("/");
        } else {
          setVerificationStatus("Email verification failed.");
        }
      } catch (error) {
        setVerificationStatus(
          error.response?.data?.message || 
            error.message ||
            "Email verification failed."
        );
      }
    };
    if (token) {
      verifyEmailToken();
    } else {
      setVerificationStatus("Token not found");
    }
    // eslint-disable-next-line
  }, [token,navigate]);

  return (
    <div>
      <h3>Email Verification Status:</h3>
      <p>{verificationStatus}</p>
    </div>
  );
};

export default VerifyEmail;
