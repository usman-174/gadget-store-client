import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "./../components/Header";


import moment from "moment";

import axios from "../http";
import Message from "./../components/LoadingError/Error";
import Loading from "./../components/LoadingError/Loading";

const OrderScreen = () => {
  window.scrollTo(0, 0);
  const [sdkReady, setSdkReady] = useState(false);
  // const sdkReady = false
  const { id: orderId } = useParams();
  // const navigate = useNavigate();

 
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // const orderDetails = useSelector((state) => state.orderDetails);
  // const { order, loading, error } = orderDetails;

  if (!loading) {
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };
    if (order) {
      order.itemsPrice = addDecimals(
        order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
      );
    }
  }
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/orders/${orderId}`);
      setOrder(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  useEffect(() => {
  //   const addPayPalScript = async () => {
  //     console.log("paypaling");
  //     try {
        
  //     const { data: clientId } = await axios.get("/api/config/paypal");
  //     const script = document.createElement("script");
  //     script.type = "text/javascript";
  //     script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
  //     script.async = true;
  //     script.onload = () => {
  //       setSdkReady(true);
  //     };
  //     document.body.appendChild(script);
  //     } catch (error) {
  //       console.log(error.messahe)
  //     }
  //   };
    if (!order) {
      fetchOrderDetails();
    } else if (!order.isPaid) {
    
      } else {
        setSdkReady(true);
      }
  // }
    // eslint-disable-next-line
  }, [ orderId, , order]);

  // const successPaymentHandler = async (paymentResult="") => {
  //   try {
  //     const { data } = await axios.put(
  //       `/api/orders/${orderId}/pay`,
  //       paymentResult
  //     );
  //     if (data) {
  //       alert("Successfully Paid");
  //       navigate("/");
  //     }
  //   } catch (error) {}
  // };

  return (
    <>
      <Header />
      <div className="container">
        {loading ? (
          <Loading />
        ) : error ? (
          <Message variant="alert-danger">{error}</Message>
        ) : (
          order && (
            <>
              <div className="row  order-detail">
                <div className="col-lg-4 col-sm-4 mb-lg-4 mb-5 mb-sm-0">
                  <div className="row">
                    <div className="col-md-4 center">
                      <div className="alert-success order-box">
                        <i className="fas fa-user"></i>
                      </div>
                    </div>
                    <div className="col-md-8 center">
                      <h5>
                        <strong>Customer</strong>
                      </h5>
                      <p>{order.user.name}</p>
                      <p>
                        <a href={`mailto:${order.user.email}`}>
                          {order.user.email}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
                {/* 2 */}
                <div className="col-lg-4 col-sm-4 mb-lg-4 mb-5 mb-sm-0">
                  <div className="row">
                    <div className="col-md-4 center">
                      <div className="alert-success order-box">
                        <i className="fas fa-truck-moving"></i>
                      </div>
                    </div>
                    <div className="col-md-8 center">
                      <h5>
                        <strong>Order info</strong>
                      </h5>
                      <p>Shipping: {order.shippingAddress.country}</p>
                      <p>Pay method: {order.paymentMethod}</p>
                      {order.isPaid ? (
                        <div className="bg-info p-2 col-12">
                          <p className="text-white text-center text-sm-start">
                            Paid on {moment(order.paidAt).calendar()}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-danger p-2 col-12">
                          <p className="text-white text-center text-sm-start">
                            Not Paid
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* 3 */}
                <div className="col-lg-4 col-sm-4 mb-lg-4 mb-5 mb-sm-0">
                  <div className="row">
                    <div className="col-md-4 center">
                      <div className="alert-success order-box">
                        <i className="fas fa-map-marker-alt"></i>
                      </div>
                    </div>
                    <div className="col-md-8 center">
                      <h5>
                        <strong>Deliver to</strong>
                      </h5>
                      <p>
                        Address: {order.shippingAddress.city},{" "}
                        {order.shippingAddress.address},{" "}
                        {order.shippingAddress.postalCode}
                      </p>
                      {order.isDelivered ? (
                        <div className="bg-info p-2 col-12">
                          <p className="text-white text-center text-sm-start">
                            Delivered on {moment(order.deliveredAt).calendar()}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-danger p-2 col-12">
                          <p className="text-white text-center text-sm-start">
                            Not Delivered
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="row order-products justify-content-between">
                <div className="col-lg-8">
                  {order.orderItems.length === 0 ? (
                    <Message variant="alert-info mt-5">
                      Your order is empty
                    </Message>
                  ) : (
                    <>
                      {order.orderItems.map((item, index) => (
                        <div className="order-product row" key={index}>
                          <div className="col-md-3 col-6">
                            <img src={item.image} alt={item.name} />
                          </div>
                          <div className="col-md-5 col-6 d-flex align-items-center">
                            <Link to={`/products/${item.product}`}>
                              <h6>{item.name}</h6>
                            </Link>
                          </div>
                          <div className="mt-3 mt-md-0 col-md-2 col-6  d-flex align-items-center flex-column justify-content-center ">
                            <h4>QUANTITY</h4>
                            <h6>{item.qty}</h6>
                          </div>
                          <div className="mt-3 mt-md-0 col-md-2 col-6 align-items-end  d-flex flex-column justify-content-center ">
                            <h4>SUBTOTAL</h4>
                            <h6>${item.qty * item.price}</h6>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
                {/* total */}
                <div className="col-lg-3 d-flex align-items-end flex-column mt-5 subtotal-order">
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <td>
                          <strong>Products</strong>
                        </td>
                        <td>${order.itemsPrice}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Shipping</strong>
                        </td>
                        <td>${order.shippingPrice}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Tax</strong>
                        </td>
                        <td>${order.taxPrice}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Total</strong>
                        </td>
                        <td>${order.totalPrice}</td>
                      </tr>
                    </tbody>
                  </table>
                  {!order.isPaid && (
                    <div className="col-12">
                      {/* {loadingPay && <Loading />} */}
                      {!sdkReady ? (
                        // <Loading />
                        <button>Pay Later</button>
                      ) : (
                        // <PayPalButton
                        //   amount={order.totalPrice}
                        //   onSuccess={successPaymentHandler}
                        // />
                      null
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )
        )}
      </div>
    </>
  );
};

export default OrderScreen;
