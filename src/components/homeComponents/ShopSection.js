import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../http";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import Rating from "./Rating";
import Pagination from "./pagination";

const ShopSection = (props) => {
  const { keyword, pagenumber } = props;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [noProducts, setNoProducts] = useState(false);

  const [productList, setProductList] = useState({
    products: [],
    page: 0,
    pages: 0,
  });

  const listProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/products?keyword=${keyword || ""}&pageNumber=${pagenumber || ""}`
      );

      if (data.products.length === 0) {
        setNoProducts(true);
      } else {
        setProductList(data);
      }

      setLoading(false);
    } catch (error) {
      if(error.message === 'Network Error'){

        setError(null);
      }
      setLoading(false);
      setNoProducts(true)
    }
  };

  useEffect(() => {
   
    listProducts();
    // eslint-disable-next-line
  }, [keyword, pagenumber]);

  return (
    <>
      <div className="container">
        <div className="section">
          <div className="row">
            <div className="col-lg-12 col-md-12 article">
              <div className="shopcontainer row">
                {loading ? (
                  <div className="mb-5">
                    <Loading />
                  </div>
                ) : error ? (
                  <Message variant="alert-danger">{error}</Message>
                ) : noProducts ? (
                  <Message variant="alert-info">No products available.</Message>
                ) : (
                  <>
                    {productList.products?.map((product) => (
                      <div
                        className="shop col-lg-4 col-md-6 col-sm-6"
                        key={product._id}
                      >
                        <div className="border-product">
                          <Link to={`/products/${product._id}`}>
                            <div className="shopBack">
                              <img src={product.image} alt={product.name} />
                            </div>
                          </Link>

                          <div className="shoptext">
                            <p>
                              <Link to={`/products/${product._id}`}>
                                {product.name}
                              </Link>
                            </p>

                            <Rating
                              value={product.rating}
                              text={`${product.numReviews} reviews`}
                            />
                            <h3>${product.price}</h3>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {!noProducts && (
                  <Pagination
                    pages={productList.pages}
                    page={productList.page}
                    keyword={keyword ? keyword : ""}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopSection;
