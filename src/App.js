import React, { useEffect, useState } from "react";
import "./App.css";
import "./responsive.css";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import SingleProduct from "./screens/SingleProduct";
import Login from "./screens/Login";
import Register from "./screens/Register";
import CartScreen from "./screens/CartScreen";
import ShippingScreen from "./screens/ShippingScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import NotFound from "./screens/NotFound";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useUser } from "./zustandStore";
import axios from "./http";
import VerifyEmail from "./screens/VerifyEmail";
const App = () => {
  const { setUser, user } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        let response;

        // Use axios if URL contains "login" string
        response = await axios.get("/api/users/me");

        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Check for user only once when the component mounts
    if (!user) {
      checkUser();
    } else {
      setLoading(false);
    }
  }, [user, setUser]);
 
 
  if (loading) {
    // Add a loading indicator here (e.g., spinner or message)
    return <div>Loading...</div>;
  }

  return (
    <GoogleOAuthProvider
      clientId={
        process.env.REACT_APP_GOOGLE_CLIENT_ID ||
        "1057261479241-8hpmvup91bpb3q997o3papc5cvdhaedi.apps.googleusercontent.com"
      }
    >
      <Router>
      
          <Routes>
          <Route path="/" element={<HomeScreen />} exact />

          <Route path="/search/:keyword" element={<HomeScreen />} exact />
          <Route path="/page/:pagenumber" element={<HomeScreen />} exact />
          <Route
            path="/search/:keyword/page/:pageNumber"
            element={<HomeScreen />}
            exact
          />
          <Route path="/products/:id" element={<SingleProduct />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/verify-email/:token' element={<VerifyEmail/>}/>
          <Route
            path="/profile"
            element={<UserProtectedRoute user={user} Element={ProfileScreen} />}
          />
          <Route path="/cart/:id?" element={<CartScreen />} />
          <Route
            path="/shipping"
            element={
              <UserProtectedRoute user={user} Element={ShippingScreen} />
            }
          />
          <Route
            path="/payment"
            element={<UserProtectedRoute user={user} Element={PaymentScreen} />}
          />
          <Route
            path="/placeorder"
            element={
              <UserProtectedRoute user={user} Element={PlaceOrderScreen} />
            }
          />
          
          <Route
            path="/order/:id"
            element={<UserProtectedRoute user={user} Element={OrderScreen} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};
const UserProtectedRoute = ({ Element, user }) => {
  if (!user) {
    return <Navigate to={"/login"} />;
  } else {
    return <Element />;
  }
};
export default App;
