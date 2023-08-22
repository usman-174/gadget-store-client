import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../http";
import { useUser } from "../zustandStore";
import Header from "./../components/Header";
import Message from "../components/LoadingError/Error";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  window.scrollTo(0, 0);
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const redirect = location.search ? location.search.split("=")[1] : "/";

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/users/login`, {
        email,
        password,
        loginMethod: "credentials",
      });
      if (data) {
        setUser(data);
        navigate("/");
      }
    } catch (error) {
      setError(error.response.data?.message || "Failed to login, Try Again.");
    }
  };

  return (
    <>
      <Header />

      <div className="container d-flex flex-column justify-content-center align-items-center login-center">
        <form
          className="Login col-md-8 col-lg-4 col-11"
          onSubmit={submitHandler}
        >
          {error ? <Message variant="alert-danger">{error}</Message> : null}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="mb-2">Login</button>
          <br/>
          
          <GoogleLogin
            auto_select={true}
            shape="pill"
            type="standard"
            text="signin_with"
            logo_alignment="left"
            width={"400px"}
            ux_mode="popup"
            onSuccess={async (res) => {
              try {
                await axios
                  .post("api/users/login", {
                    ...res,
                    loginMethod: "google",
                  })
                  .then(({ data }) => {
                    if (data) {
                      setUser(data);
                      navigate("/");
                    }
                  });
              } catch (error) {
                setError(
                  error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    error?.message
                );
              }
            }}
            onError={() => {}}
            one
          />
          <br/>
          <p>
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
            >
              Create Account
            </Link>
          </p>
        </form>
     
      </div>
    </>
  );
};

export default Login;
